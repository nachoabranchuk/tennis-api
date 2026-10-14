// Autorizacion por rol. Se usa SIEMPRE despues de authMiddleware, que es quien carga req.userRole.
// 401 = no sabemos quien sos (falta autenticar). 403 = sabemos quien sos, pero no tenes permiso.
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/auth.types";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(401).json({ success: false, error: { message: "Sesion requerida" } });
      return;
    }

    if (!allowedRoles.includes(req.userRole)) {
      res.status(403).json({
        success: false,
        error: { message: "No tenes permisos para realizar esta accion" },
      });
      return;
    }

    next();
  };
}
