import * as crypto from 'crypto';
import {ENCRYPT_SECRET} from '../constants/auth.constent';

export function encrypt(text: string) {
  const algorithm = 'aes-192-cbc';
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(ENCRYPT_SECRET, 'salt', 24);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}
