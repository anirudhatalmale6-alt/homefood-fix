import { Request, Response } from "express";
import { MENU_CATALOG } from "../data/menu-catalog";

export const getMenuCatalog = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: { items: MENU_CATALOG }
  });
};
