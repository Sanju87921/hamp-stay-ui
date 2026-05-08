import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6";
const IV_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM
 */
export function encrypt(text: string): string {
  if (!text) return "";
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return "";
  
  try {
    const [ivHex, authTagHex, encryptedText] = encryptedData.split(":");
    
    if (!ivHex || !authTagHex || !encryptedText) {
      throw new Error("Invalid encrypted data format");
    }
    
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return "[DECRYPTION_FAILED]";
  }
}
