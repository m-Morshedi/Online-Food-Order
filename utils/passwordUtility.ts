import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { VendorPayload } from '../dto';
import { Request } from 'express';
import { AuthPayload } from '../dto/Auth.dto';

export const Salt = async () => {
  return await bcrypt.genSalt();
};

export const hashPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

export const createJWT = (payload: VendorPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });
  return token;
};

export const validateJWT = async (req: Request) => {
  const token = req.get('Authorization');

  if (token) {
    const payload = (await jwt.verify(
      token.split(' ')[1],
      process.env.JWT_SECRET!
    )) as AuthPayload;
    req.user = payload;
    return true;
  }
  return false;
};
