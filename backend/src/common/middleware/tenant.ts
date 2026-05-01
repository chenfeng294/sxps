import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';

declare global {
  namespace Express {
    interface Request {
      tenantId: string;
    }
  }
}

export const tenantMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tenantId = req.headers['x-tenant-id'] as string || config.app.defaultTenantId;
  
  req.tenantId = tenantId;
  
  next();
};
