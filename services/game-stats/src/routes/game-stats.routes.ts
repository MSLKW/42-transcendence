import { Router } from "express";
import { healthCheck } from "../handlers/healthCheck";

export const gameStatsRouter = Router();

gameStatsRouter.get("/health", healthCheck);