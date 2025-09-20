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

    console.log(`Creating prayer: ${prayerName} on ${date}`);

    // The date string is already in YYYY-MM-DD format from the client.
    // Let Prisma handle the date string directly. It will be stored as UTC.
    const prayerDate = new Date(date);

    // Check if prayer already exists for this user, prayer, and date
    const existingPrayer = await prisma.prayer.findFirst({
      where: {
        userId,
        prayerName,
        date: prayerDate,
      },
    });

    if (existingPrayer) {
      console.log(
        `Prayer already exists for ${prayerName} on ${prayerDate.toDateString()}`
      );
      return res
        .status(409)
        .json({
          message: "Prayer already exists for this date and prayer name",
        });
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
      // Use same date parsing logic as other endpoints for consistency
      const dateStr = date as string;
      const [year, month, day] = dateStr.split("-").map(Number);
      const queryDate = new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed
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
      // Parse date strings as YYYY-MM-DD in UTC
      const [startYear, startMonth, startDay] = (startDate as string)
        .split("-")
        .map(Number);
      const [endYear, endMonth, endDay] = (endDate as string)
        .split("-")
        .map(Number);

      dateFilter = {
        date: {
          gte: new Date(Date.UTC(startYear, startMonth - 1, startDay)),
          lte: new Date(Date.UTC(endYear, endMonth - 1, endDay)),
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
