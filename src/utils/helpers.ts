// Helper to build query string from pagination params
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};

// Format date to look nicer
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return `Created ${date
    .toLocaleDateString("en-US", options)
    .replace(",", " at")}`;
};

export const formatTimeRemaining = (milliseconds: number) => {
  if (milliseconds <= 0) return "00:00";

  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

// Format datetime to readable time
export const formatTimeDisplay = (dateTimeString: string) => {
  if (!dateTimeString) return "";

  try {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return dateTimeString;
  }
};

export const calculateRemainingTime = (
  createdAt: string,
  expiresIn: number
): { value: number; unit: string } => {
  const createdTime = new Date(createdAt).getTime();
  const currentTime = new Date().getTime();
  const expirationTime = createdTime + expiresIn * 60 * 1000;
  const remainingMilliseconds = expirationTime - currentTime;

  if (remainingMilliseconds <= 0) {
    return { value: 0, unit: "min" };
  }

  const remainingMinutes = Math.floor(remainingMilliseconds / (60 * 1000));

  if (remainingMinutes > 0) {
    return { value: remainingMinutes, unit: "min" };
  } else {
    const remainingSeconds = Math.floor(remainingMilliseconds / 1000);
    return { value: remainingSeconds, unit: "sec" };
  }
};

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "active":
      return "success";
    case "expired":
      return "medium";
    case "revoked":
      return "danger";
    default:
      return "primary";
  }
};

export const formatStatus = (status: string): string => {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const createFileName = (
  visitorName: string,
  prefix = "access-code"
): string => {
  const sanitizedName = visitorName.replace(/[^a-zA-Z0-9]/g, "_");
  return `${prefix}-${sanitizedName}.png`;
};

export const downloadFile = (dataUrl: string, fileName: string): void => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const canShareFiles = (): boolean => {
  return !!(navigator && "share" in navigator && "canShare" in navigator);
};

export const shareFile = async (
  file: File,
  title: string,
  text: string
): Promise<void> => {
  if (canShareFiles() && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title,
      text,
      files: [file],
    });
  } else {
    throw new Error("File sharing not supported");
  }
};

export const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  return await response.blob();
};
