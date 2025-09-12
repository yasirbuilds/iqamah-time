import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middlewares/auth";

const prisma = new PrismaClient();

// Create prayer status
export const createPrayer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { prayerName, prayerType, date } = req.body;
    const userId = req.user!.id;

    // Parse date to ensure it's a valid date
    const prayerDate = new Date(date);
    prayerDate.setHours(0, 0, 0, 0); // Reset time to start of day

    // Check if prayer already exists for this user, prayer, and date
    const existingPrayer = await prisma.prayer.findUnique({
      where: {
        userId_prayerName_date: {
          userId,
          prayerName,
          date: prayerDate,
        },
      },
    });

    if (existingPrayer) {
      return res.status(409).json({ message: "Prayer already exists for this date and prayer name" });
    }

    // Create new prayer
    const prayer = await prisma.prayer.create({
      data: {
        userId,
        prayerName,
        prayerType,
        date: prayerDate,
      },
    });

    res.json({
      message: "Prayer created successfully",
      prayer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all prayers for a user with optional date filter
export const getUserPrayers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const { date, page = "1", limit = "50" } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    let whereClause: any = { userId };

    if (date) {
      const queryDate = new Date(date as string);
      queryDate.setHours(0, 0, 0, 0);
      whereClause.date = queryDate;
    }

    const [prayers, totalCount] = await Promise.all([
      prisma.prayer.findMany({
        where: whereClause,
        orderBy: [{ date: "desc" }, { prayerName: "asc" }],
        skip,
        take,
      }),
      prisma.prayer.count({ where: whereClause }),
    ]);

    res.json({
      prayers,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        limit: take,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get prayers for current date
export const getTodayPrayers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prayers = await prisma.prayer.findMany({
      where: {
        userId,
        date: today,
      },
      orderBy: { prayerName: "asc" },
    });

    // Create a complete list of today's prayers with status
    const allPrayers = ["FAJR", "DHUHR", "ASR", "MAGHRIB", "ISHA"].map(
      (prayerName) => {
        const existingPrayer = prayers.find((p:any) => p.prayerName === prayerName);
        return {
          prayerName,
          prayerType: existingPrayer?.prayerType || null,
          id: existingPrayer?.id || null,
          date: today,
        };
      }
    );

    res.json({ prayers: allPrayers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single prayer by ID
export const getPrayerById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const prayer = await prisma.prayer.findFirst({
      where: {
        id,
        userId, // Ensure user can only access their own prayers
      },
    });

    if (!prayer) {
      return res.status(404).json({ message: "Prayer not found" });
    }

    res.json({ prayer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update prayer status
export const updatePrayer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { prayerType } = req.body;
    const userId = req.user!.id;

    // Check if prayer exists and belongs to the user
    const existingPrayer = await prisma.prayer.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingPrayer) {
      return res.status(404).json({ message: "Prayer not found" });
    }

    const updatedPrayer = await prisma.prayer.update({
      where: { id },
      data: { prayerType },
    });

    res.json({
      message: "Prayer updated successfully",
      prayer: updatedPrayer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete prayer
export const deletePrayer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if prayer exists and belongs to the user
    const existingPrayer = await prisma.prayer.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingPrayer) {
      return res.status(404).json({ message: "Prayer not found" });
    }

    await prisma.prayer.delete({
      where: { id },
    });

    res.json({ message: "Prayer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get prayer statistics
export const getPrayerStats = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate } = req.query;

    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      };
    }

    const stats = await prisma.prayer.groupBy({
      by: ["prayerType"],
      where: {
        userId,
        ...dateFilter,
      },
      _count: {
        prayerType: true,
      },
    });

    const formattedStats = stats.reduce((acc, stat) => {
      acc[stat.prayerType] = stat._count.prayerType;
      return acc;
    }, {} as Record<string, number>);

    res.json({ stats: formattedStats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
