import { Response } from "express";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, "../..", "logs", "webhook.log")

export const logWebhook = (message: string) => {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, "utf8")
}

export const handleError = (res: Response, message: string, logMessage: string) => {
  logWebhook(logMessage);
  console.error(logMessage)
  res.status(200).send(message)
}