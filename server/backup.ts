import { storage } from "./storage";
import * as fs from "fs";
import * as path from "path";

export interface DatabaseBackup {
  timestamp: string;
  users: any[];
  excelData: any[];
  metadata: {
    version: string;
    totalUsers: number;
    totalFiles: number;
    totalRecords: number;
  };
}

export class BackupManager {
  private backupDir = path.join(process.cwd(), "backups");

  constructor() {
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `backup-${timestamp}.json`;
      const filepath = path.join(this.backupDir, filename);

      // Get all data from database
      const excelData = await storage.getAllExcelData();
      const stats = await storage.getExcelDataStats();

      const backup: DatabaseBackup = {
        timestamp: new Date().toISOString(),
        users: [], // Users are handled by Replit Auth
        excelData,
        metadata: {
          version: "1.0.0",
          totalUsers: 0,
          totalFiles: stats.totalFiles,
          totalRecords: stats.totalRecords,
        },
      };

      // Write backup to file
      fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));

      console.log(`Database backup created: ${filename}`);
      return filepath;
    } catch (error) {
      console.error("Error creating backup:", error);
      throw error;
    }
  }

  async restoreFromBackup(filepath: string): Promise<void> {
    try {
      if (!fs.existsSync(filepath)) {
        throw new Error(`Backup file not found: ${filepath}`);
      }

      const backupData = JSON.parse(fs.readFileSync(filepath, "utf-8")) as DatabaseBackup;
      
      console.log(`Restoring backup from ${backupData.timestamp}`);
      console.log(`Restoring ${backupData.excelData.length} Excel data entries`);

      // Restore Excel data
      for (const entry of backupData.excelData) {
        await storage.createExcelData({
          month: entry.month,
          year: entry.year,
          fileName: entry.fileName,
          data: entry.data,
          recordCount: entry.recordCount,
          userId: entry.userId,
        });
      }

      console.log("Database restoration completed successfully");
    } catch (error) {
      console.error("Error restoring backup:", error);
      throw error;
    }
  }

  getBackupFiles(): string[] {
    try {
      return fs.readdirSync(this.backupDir)
        .filter(file => file.endsWith('.json') && file.startsWith('backup-'))
        .sort()
        .reverse(); // Most recent first
    } catch (error) {
      console.error("Error listing backup files:", error);
      return [];
    }
  }

  async scheduleAutoBackup(): Promise<void> {
    // Create backup every 24 hours
    const createBackupInterval = () => {
      this.createBackup().catch(console.error);
    };

    // Create initial backup
    createBackupInterval();

    // Schedule daily backups
    setInterval(createBackupInterval, 24 * 60 * 60 * 1000);
    
    console.log("Automatic daily backups scheduled");
  }
}

export const backupManager = new BackupManager();