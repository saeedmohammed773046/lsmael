import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'غير مصرح بالدخول، يرجى تسجيل الدخول' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'ismail_wedding_events_super_secret_jwt_key_2026_production';
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string; name: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'المستخدم غير موجود أو تم تعطيل حسابه' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'رمز الدخول غير صالح أو منتهي الصلاحية' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'يرجى تسجيل الدخول أولاً' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'ليس لديك الصلاحية الكافية للقيام بهذا الإجراء' });
      return;
    }

    next();
  };
};
