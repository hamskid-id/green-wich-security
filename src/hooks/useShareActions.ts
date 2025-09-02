import { useCallback } from "react";
import QRCode from "qrcode";
import { formatDate } from "../utils/helpers";
import { AccessCode } from "../types";

export interface ShareActions {
  shareAsText: () => Promise<void>;
  showQRCode: () => Promise<void>;
  downloadCode: () => Promise<void>;
  shareAsImage: () => Promise<void>;
}

interface UseShareActionsProps {
  accessCode: AccessCode | null;
  onToast?: (message: string) => void;
  onClose?: () => void;
  setQrCodeDataUrl: (url: string) => void;
  setActiveView: (view: "options" | "qr") => void;
  setIsGeneratingQR: (loading: boolean) => void;
}

export const useShareActions = ({
  accessCode,
  onToast,
  onClose,
  setQrCodeDataUrl,
  setActiveView,
  setIsGeneratingQR,
}: UseShareActionsProps): ShareActions => {
  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          onToast?.("Code copied to clipboard");
        } else {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand("copy");
            onToast?.("Code copied to clipboard");
          } catch (fallbackError) {
            onToast?.("Failed to copy to clipboard");
          }
          document.body.removeChild(textArea);
        }
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        onToast?.("Failed to copy to clipboard");
      }
    },
    [onToast]
  );

  const generateQRCode = useCallback(async (): Promise<string> => {
    if (!accessCode) throw new Error("No access code available");

    const visitorName = accessCode.visitor_name || "Unknown Visitor";
    const code = accessCode.code || "N/A";
    const status = accessCode.status || "unknown";
    const createdAt = accessCode.created_at || new Date().toISOString();

    const qrData = JSON.stringify({
      code: code,
      visitor_name: visitorName,
      created_at: createdAt,
      status: status,
    });

    try {
      return await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw new Error("Failed to generate QR code");
    }
  }, [accessCode]);

  const shareAsText = useCallback(async () => {
    if (!accessCode) return;

    try {
      const visitorName = accessCode.visitor_name || "Unknown Visitor";
      const code = accessCode.code || "N/A";
      const status = accessCode.status || "unknown";
      const createdAt = accessCode.created_at || new Date().toISOString();

      const shareText = `Access Code for ${visitorName}\nCode: ${code}\nExpires: ${formatDate(
        createdAt
      )}\nStatus: ${status}`;

      if (navigator?.share) {
        try {
          await navigator.share({
            title: "Access Code",
            text: shareText,
          });
          onToast?.("Code shared successfully");
        } catch (error) {
          // User cancelled or error occurred
          await copyToClipboard(shareText);
        }
      } else {
        await copyToClipboard(shareText);
      }
      onClose?.();
    } catch (error) {
      console.error("Error sharing as text:", error);
      onToast?.("Failed to share access code");
    }
  }, [accessCode, onToast, onClose, copyToClipboard]);

  const showQRCode = useCallback(async () => {
    setIsGeneratingQR(true);
    try {
      const qrDataUrl = await generateQRCode();
      setQrCodeDataUrl(qrDataUrl);
      setActiveView("qr");
    } catch (error) {
      console.error("Error showing QR code:", error);
      onToast?.("Failed to generate QR code");
    } finally {
      setIsGeneratingQR(false);
    }
  }, [
    generateQRCode,
    setQrCodeDataUrl,
    setActiveView,
    setIsGeneratingQR,
    onToast,
  ]);

  const createShareImage = useCallback(async (): Promise<string> => {
    if (!accessCode) throw new Error("No access code available");

    const visitorName = accessCode.visitor_name || "Unknown Visitor";
    const code = accessCode.code || "N/A";
    const status = accessCode.status || "unknown";
    const createdAt = accessCode.created_at || new Date().toISOString();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    // Generate QR code first
    const qrDataUrl = await generateQRCode();

    // Set canvas size (made wider to accommodate QR code)
    canvas.width = 800;
    canvas.height = 500;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Header
    ctx.fillStyle = "#004225";
    ctx.fillRect(20, 20, canvas.width - 40, 60);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Access Code", canvas.width / 2, 55);

    // Left side - Text information
    const leftSide = canvas.width * 0.55; // 55% for text side

    // Visitor name
    ctx.fillStyle = "#000000";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText(visitorName, leftSide / 2, 120);

    // Code
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#004225";
    ctx.fillText(`Code: ${code}`, leftSide / 2, 165);

    // Status and expiry
    ctx.font = "18px Arial";
    ctx.fillStyle = "#666666";
    ctx.fillText(`Status: ${status.toUpperCase()}`, leftSide / 2, 200);

    ctx.fillText(`Created: ${formatDate(createdAt)}`, leftSide / 2, 225);

    // Right side - QR Code
    return new Promise((resolve, reject) => {
      const qrImage = new Image();
      qrImage.onload = () => {
        try {
          // Draw vertical separator line
          ctx.strokeStyle = "#e0e0e0";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(leftSide, 90);
          ctx.lineTo(leftSide, canvas.height - 30);
          ctx.stroke();

          // QR Code section
          const qrStartX = leftSide + 20;
          const qrCenterX = qrStartX + (canvas.width - qrStartX - 20) / 2;
          const qrSize = 180; // QR code size
          const qrY = 120;

          // QR Code title
          ctx.fillStyle = "#004225";
          ctx.font = "bold 20px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Scan QR Code", qrCenterX, 110);

          // Draw QR code
          ctx.drawImage(qrImage, qrCenterX - qrSize / 2, qrY, qrSize, qrSize);

          // QR Code instruction
          ctx.fillStyle = "#666666";
          ctx.font = "14px Arial";
          ctx.fillText(
            "Scan to access code details",
            qrCenterX,
            qrY + qrSize + 25
          );

          resolve(canvas.toDataURL("image/png"));
        } catch (error) {
          reject(error);
        }
      };
      qrImage.onerror = () => {
        reject(new Error("Failed to load QR code image"));
      };
      qrImage.src = qrDataUrl;
    });
  }, [accessCode, generateQRCode]);

  const shareAsImage = useCallback(async () => {
    if (!accessCode) return;

    try {
      const visitorName = accessCode.visitor_name || "Unknown Visitor";
      const imageDataUrl = await createShareImage();

      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();

      const fileName = `access-code-${visitorName.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}.png`;

      if (
        navigator?.share &&
        navigator?.canShare &&
        navigator.canShare({
          files: [new File([blob], fileName, { type: "image/png" })],
        })
      ) {
        const file = new File([blob], fileName, { type: "image/png" });
        await navigator.share({
          title: "Access Code",
          text: `Access code for ${visitorName}`,
          files: [file],
        });
        onToast?.("Code shared as image successfully");
      } else {
        // Fallback: create download link
        const link = document.createElement("a");
        link.href = imageDataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onToast?.("Image downloaded successfully");
      }
    } catch (error) {
      console.error("Error sharing as image:", error);
      onToast?.("Failed to share as image");
    }
    onClose?.();
  }, [accessCode, createShareImage, onToast, onClose]);

  const downloadCode = useCallback(async () => {
    if (!accessCode) return;

    try {
      const visitorName = accessCode.visitor_name || "Unknown Visitor";
      const imageDataUrl = await createShareImage();
      const fileName = `access-code-${visitorName.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}.png`;

      // Create download link
      const link = document.createElement("a");
      link.href = imageDataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onToast?.("Access code downloaded successfully");
    } catch (error) {
      console.error("Error downloading access code:", error);
      onToast?.("Failed to download access code");
    }
    onClose?.();
  }, [accessCode, createShareImage, onToast, onClose]);

  return {
    shareAsText,
    showQRCode,
    downloadCode,
    shareAsImage,
  };
};
