import { Router } from "express";
import { healthCheck } from "../handlers/health/healthCheck";

export const healthRouter = Router();

healthRouter.get("/health", healthCheck);