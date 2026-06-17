import { Router } from "express";
import { getMenuCatalog } from "../controllers/menu.controller";

const router = Router();

router.get("/catalog", getMenuCatalog);

export default router;
