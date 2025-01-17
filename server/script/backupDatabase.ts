import { exec } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { backUpToS3 } from '../utils/s3Utils';

// Load environment variables from .env file
dotenv.config();

const backupDatabase = () => {
  const dbUsername = process.env.DB_USERNAME || '';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || '';
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT;
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const backupFileName = `${dbName}-${timestamp}.gz`;
  const backupFilePath = path.join(__dirname, backupFileName);

  const dumpCommand = `mongodump --uri="mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=${process.env.DB_AUTH_SOURCE}" --archive=${backupFilePath} --gzip`;
  console.log("1: Starting database backup...");
  console.log(`Dump Command: ${dumpCommand}`);

  exec(dumpCommand, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating backup: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Standard Error: ${stderr}`);
      // return;
    }

    console.log(`Database backup created successfully ✅: ${backupFilePath}`);
    console.log("2: Backup created");

    try {
      if (!fs.existsSync(backupFilePath)) {
        console.error(`Backup file does not exist: ${backupFilePath}`);
        return;
      }
      
      console.log("3: Reading backup file");
      const fileBuffer = fs.readFileSync(backupFilePath);
      console.log("4: Backup file read successfully");

      const s3Url = await backUpToS3(fileBuffer, backupFileName, 'db-backup');
      console.log("5: Uploading to S3");

      console.log(`Backup successfully uploaded to S3: ${s3Url}`);
      console.log("6: Upload complete");

      // Clean up: remove the local backup file
      fs.unlinkSync(backupFilePath);
      console.log("7: Local backup file removed");

      console.log(`Local backup file removed: ${backupFilePath}`);
    } catch (e: any) {
      console.error(`Error during backup process: ${e.message}`);
    }
  });
};

export default backupDatabase;