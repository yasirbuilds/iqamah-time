import { body, validationResult, param, query } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Middleware to handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for registration
export const validateRegister = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  handleValidationErrors,
];

// Validation rules for login
export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("password").exists().withMessage("Password is required"),
  handleValidationErrors,
];

// Validation rules for prayer creation/update
export const validatePrayer = [
  body("prayerName")
    .isIn(["FAJR", "DHUHR", "ASR", "MAGHRIB", "ISHA"])
    .withMessage("Invalid prayer name"),
  body("prayerType")
    .isIn(["JAMMAT", "ALONE", "QAZAH", "MISSED"])
    .withMessage("Invalid prayer type"),
  body("date").isISO8601().toDate().withMessage("Invalid date format"),
  handleValidationErrors,
];

// Validation for prayer ID parameter
export const validatePrayerId = [
  param("id").isUUID().withMessage("Invalid prayer ID"),
  handleValidationErrors,
];

// Validation for date query
export const validateDateQuery = [
  query("date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),
  handleValidationErrors,
];

// Validation rules for prayer update (only validates prayerType)
export const validatePrayerUpdate = [
  body("prayerType")
    .isIn(["JAMMAT", "ALONE", "QAZAH", "MISSED"])
    .withMessage("Invalid prayer type"),
  handleValidationErrors,
];

// Validation rules for Google Sign-In
export const validateGoogleSignIn = [
  body("token")
    .exists()
    .withMessage("Google token is required")
    .isString()
    .withMessage("Google token must be a string")
    .isLength({ min: 10 })
    .withMessage("Invalid Google token format"),
  handleValidationErrors,
];
