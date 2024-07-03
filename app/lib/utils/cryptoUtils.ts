import crypto from 'crypto';
import {ENCRYPT_SECRET} from '../constants/auth.constent';

export function encrypt(text: string) {
  try {
    const algorithm = 'aes-192-cbc';
    const iv = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(ENCRYPT_SECRET, 'salt', 100000, 24, 'sha512');

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Encryption failed');
  }
}
