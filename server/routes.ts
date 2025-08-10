import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertExcelDataSchema } from "@shared/schema";
import { backupManager } from "./backup";
import multer, { type Multer } from "multer";
import * as XLSX from "xlsx";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit to be safe
    fieldSize: 2 * 1024 * 1024, // 2MB for form fields
    files: 1, // Only 1 file at a time
    parts: 10 // Limit number of parts
  },
  fileFilter: (req, file, cb) => {
    console.log(`File filter check: ${file.originalname}, mimetype: ${file.mimetype}`);
    
    // Accept Excel and CSV files
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/octet-stream' // Sometimes Excel files come as this
    ];
    
    const fileExtension = file.originalname.toLowerCase();
    const isValidExtension = fileExtension.endsWith('.xlsx') || 
                           fileExtension.endsWith('.xls') || 
                           fileExtension.endsWith('.csv');
    
    if (allowedTypes.includes(file.mimetype) || isValidExtension) {
      console.log('File accepted by filter');
      cb(null, true);
    } else {
      console.log('File rejected by filter');
      const error = new Error('Only Excel (.xlsx, .xls) and CSV files are allowed') as any;
      error.code = 'INVALID_FILE_TYPE';
      cb(error, false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Excel data routes
  app.post('/api/excel-data', async (req, res) => {
    try {
      const validatedData = insertExcelDataSchema.parse(req.body);
      const entry = await storage.createExcelData(validatedData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating Excel data:", error);
      res.status(400).json({ message: "Invalid data provided" });
    }
  });

  app.post('/api/excel-data/upload', upload.single('file'), async (req: Request & { file?: Express.Multer.File }, res) => {
    try {
      console.log("Upload request received");
      console.log("Request body:", req.body);
      console.log("File info:", req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : "No file");
      
      if (!req.file) {
        console.error("No file in request");
        return res.status(400).json({ 
          message: "No file uploaded. Please select a valid Excel or CSV file." 
        });
      }

      console.log(`Processing file: ${req.file.originalname}, size: ${req.file.size} bytes, type: ${req.file.mimetype}`);

      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        return res.status(400).json({ 
          message: "No sheets found in the Excel file." 
        });
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        return res.status(400).json({ 
          message: "No data found in the Excel file." 
        });
      }

      const { month, year } = req.body;
      
      if (!month || !year) {
        return res.status(400).json({ 
          message: "Month and year are required." 
        });
      }
      
      const entry = await storage.createExcelData({
        month,
        year: parseInt(year),
        fileName: req.file.originalname,
        data: data as any,
        recordCount: data.length,
        userId: null, // For now, allow anonymous submissions
      });

      console.log(`Successfully processed file with ${data.length} records`);
      res.json(entry);
    } catch (error) {
      console.error("Error processing uploaded file:", error);
      res.status(500).json({ 
        message: "Failed to process file. Please ensure it's a valid Excel or CSV file." 
      });
    }
  });

  app.get('/api/excel-data', isAuthenticated, async (req, res) => {
    try {
      const data = await storage.getAllExcelData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching Excel data:", error);
      res.status(500).json({ message: "Failed to fetch data" });
    }
  });

  app.get('/api/excel-data/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getExcelDataStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get('/api/excel-data/:id', isAuthenticated, async (req, res) => {
    try {
      const entry = await storage.getExcelData(req.params.id);
      if (!entry) {
        return res.status(404).json({ message: "Data not found" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error fetching Excel data:", error);
      res.status(500).json({ message: "Failed to fetch data" });
    }
  });

  app.delete('/api/excel-data/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteExcelData(req.params.id);
      res.json({ message: "Data deleted successfully" });
    } catch (error) {
      console.error("Error deleting Excel data:", error);
      res.status(500).json({ message: "Failed to delete data" });
    }
  });

  app.get('/api/excel-data/:id/download', isAuthenticated, async (req, res) => {
    try {
      const entry = await storage.getExcelData(req.params.id);
      if (!entry) {
        return res.status(404).json({ message: "Data not found" });
      }

      // Convert JSON data back to Excel format
      const worksheet = XLSX.utils.json_to_sheet(entry.data as any[]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Disposition', `attachment; filename="${entry.fileName || 'data.xlsx'}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  // Backup routes (admin only)
  app.post('/api/backup/create', isAuthenticated, async (req, res) => {
    try {
      const filepath = await backupManager.createBackup();
      res.json({ 
        message: "Backup created successfully",
        filepath: filepath.split('/').pop() // Only return filename for security
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  app.get('/api/backup/list', isAuthenticated, async (req, res) => {
    try {
      const backups = backupManager.getBackupFiles();
      res.json({ backups });
    } catch (error) {
      console.error("Error listing backups:", error);
      res.status(500).json({ message: "Failed to list backups" });
    }
  });

  // Initialize auto-backup system
  backupManager.scheduleAutoBackup();

  const httpServer = createServer(app);
  return httpServer;
}
