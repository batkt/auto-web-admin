import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm'; // эсвэл 'aes-256-cbc'
const IV_LENGTH = 16; // AES блок хэмжээ

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function encryptJSON(data: any, secret: string) {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    crypto.createHash('sha256').update(secret).digest(),
    iv
  );

  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag(); // GCM бол энэ хэрэгтэй

  return {
    iv: iv.toString('base64'),
    content: encrypted,
    tag: authTag.toString('base64'),
  };
}

export function decryptJSON(
  encrypted: { iv: string; content: string; tag: string },
  secret: string
) {
  const iv = Buffer.from(encrypted.iv, 'base64');
  const authTag = Buffer.from(encrypted.tag, 'base64');

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    crypto.createHash('sha256').update(secret).digest(),
    iv
  );
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted.content, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}
