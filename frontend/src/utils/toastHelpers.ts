import { toast } from "sonner";

// Success messages for different prayer statuses
export const PRAYER_SUCCESS_MESSAGES = {
  JAMMAT: {
    create: (prayerName: string) => `${prayerName} prayer recorded as Jamaat!`,
    update: (prayerName: string) => `${prayerName} prayer updated to Jamaat!`,
  },
  ALONE: {
    create: (prayerName: string) =>
      `${prayerName} prayer recorded as alone!`,
    update: (prayerName: string) =>
      `${prayerName} prayer updated to alone prayer!`,
  },
  QAZAH: {
    create: (prayerName: string) => `${prayerName} prayer recorded as Qazah!`,
    update: (prayerName: string) => `${prayerName} prayer updated to Qazah!`,
  },
  MISSED: {
    create: (prayerName: string) => `${prayerName} prayer marked as missed.`,
    update: (prayerName: string) => `${prayerName} prayer updated to missed.`,
  },
};

// Custom toast functions with better styling and messages
export const showPrayerSuccessToast = (
  prayerName: string,
  status: keyof typeof PRAYER_SUCCESS_MESSAGES,
  isUpdate = false
) => {
  const message = isUpdate
    ? PRAYER_SUCCESS_MESSAGES[status].update(prayerName)
    : PRAYER_SUCCESS_MESSAGES[status].create(prayerName);

  if (status === "MISSED") {
    // Use warning toast for missed prayers
    toast(message, {
      style: {
        background: "rgba(251, 146, 60, 0.1)",
        borderColor: "rgba(251, 146, 60, 0.7)",
        color: "rgb(251, 146, 60)",
      },
    });
  } else {
    toast.success(message);
  }
};

// Enhanced error toast with backend message support
export const showErrorToast = (message: string, backendError?: any) => {
  let errorMessage = message;

  if (backendError) {
    // Try to extract meaningful error message from backend
    if (typeof backendError === "string") {
      errorMessage = backendError;
    } else if (backendError.response?.data?.message) {
      errorMessage = backendError.response.data.message;
    } else if (backendError.message) {
      errorMessage = backendError.message;
    } else if (backendError.error) {
      errorMessage = backendError.error;
    }
  }

  toast.error(`${errorMessage}`);
};

// Success toast for auth actions
export const showAuthSuccessToast = (message: string) => {
  toast.success(`${message}`);
};

// Info toast for general information
export const showInfoToast = (message: string) => {
  toast.info(`${message}`);
};

// Loading toast for async operations
export const showLoadingToast = (message: string) => {
  return toast.loading(`${message}`);
};
