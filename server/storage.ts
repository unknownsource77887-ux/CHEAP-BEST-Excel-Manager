import {
  users,
  excelData,
  type User,
  type UpsertUser,
  type InsertExcelData,
  type ExcelDataEntry,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Excel data operations
  createExcelData(data: InsertExcelData): Promise<ExcelDataEntry>;
  getExcelData(id: string): Promise<ExcelDataEntry | undefined>;
  getAllExcelData(): Promise<ExcelDataEntry[]>;
  deleteExcelData(id: string): Promise<void>;
  getExcelDataStats(): Promise<{
    totalFiles: number;
    totalRecords: number;
    thisMonth: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Excel data operations
  async createExcelData(data: InsertExcelData): Promise<ExcelDataEntry> {
    const [entry] = await db
      .insert(excelData)
      .values(data)
      .returning();
    return entry;
  }

  async getExcelData(id: string): Promise<ExcelDataEntry | undefined> {
    const [entry] = await db
      .select()
      .from(excelData)
      .where(eq(excelData.id, id));
    return entry;
  }

  async getAllExcelData(): Promise<ExcelDataEntry[]> {
    return await db
      .select()
      .from(excelData)
      .orderBy(desc(excelData.createdAt));
  }

  async deleteExcelData(id: string): Promise<void> {
    await db
      .delete(excelData)
      .where(eq(excelData.id, id));
  }

  async getExcelDataStats(): Promise<{
    totalFiles: number;
    totalRecords: number;
    thisMonth: number;
  }> {
    const allData = await this.getAllExcelData();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonth = allData.filter(entry => {
      const entryDate = new Date(entry.createdAt!);
      return entryDate.getMonth() === currentMonth && 
             entryDate.getFullYear() === currentYear;
    }).length;

    const totalRecords = allData.reduce((sum, entry) => sum + entry.recordCount, 0);

    return {
      totalFiles: allData.length,
      totalRecords,
      thisMonth,
    };
  }
}

export const storage = new DatabaseStorage();
