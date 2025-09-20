import { Router } from "express";
import {
  createPrayer,
  getUserPrayers,
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

// Middleware
// All prayer routes require authentication
router.use(authenticateToken);

// POST /prayers - Create prayer status
router.post("/", validatePrayer, createPrayer);

// GET /prayers - Get all prayers with optional filters
router.get("/", validateDateQuery, getUserPrayers);

// GET /prayers/stats - Get prayer statistics
router.get("/stats", getPrayerStats);

// PUT /prayers/:id - Update prayer status
router.put("/:id", validatePrayerId, validatePrayerUpdate, updatePrayer);

// DELETE /prayers/:id - Delete prayer
router.delete("/:id", validatePrayerId, deletePrayer);

export default router;
