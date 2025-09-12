import { Router } from "express";
import {
  createPrayer,
  getUserPrayers,
  getTodayPrayers,
  getPrayerById,
  updatePrayer,
  deletePrayer,
  getPrayerStats,
} from "../controllers/prayerController";
import {
  validatePrayer,
  validatePrayerId,
  validateDateQuery,
  validatePrayerUpdate,
} from "../middlewares/validation";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// All prayer routes require authentication
router.use(authenticateToken);

// POST /prayers - Create prayer status
router.post("/", validatePrayer, createPrayer);

// GET /prayers - Get all prayers with optional filters
router.get("/", validateDateQuery, getUserPrayers);

// GET /prayers/today - Get today's prayers
router.get("/today", getTodayPrayers);

// GET /prayers/stats - Get prayer statistics
router.get("/stats", getPrayerStats);

// GET /prayers/:id - Get single prayer
router.get("/:id", validatePrayerId, getPrayerById);

// PUT /prayers/:id - Update prayer status
router.put("/:id", validatePrayerId, validatePrayerUpdate, updatePrayer);

// DELETE /prayers/:id - Delete prayer
router.delete("/:id", validatePrayerId, deletePrayer);

export default router;
