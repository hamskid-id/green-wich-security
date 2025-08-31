import React, { useRef, useState, useEffect } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonLabel,
  IonBadge,
  IonList,
  IonItem,
  IonButtons,
  IonSpinner,
} from "@ionic/react";
import {
  close,
  shareOutline,
  imageOutline,
  downloadOutline,
  qrCodeOutline,
  arrowBack,
  arrowRedoSharp,
} from "ionicons/icons";
import QRCode from "qrcode";
import "./ShareAccessCodeModal.css";
import { AccessCode } from "../../../types";
import { calculateRemainingTime, formatDate } from "../../../utils/helpers";
import CustomButton from "../customButton/CustomButton";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessCode: AccessCode | null;
  onToast: (message: string) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  accessCode,
  onToast,
}) => {
  const [activeView, setActiveView] = useState<"options" | "qr">("options");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // Early return if accessCode is null or undefined
  if (!accessCode) {
    return (
      <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader className="app-header">
          <IonToolbar>
            <IonTitle>Share Access Code</IonTitle>
            <IonButtons slot="end">
              <IonButton fill="clear" onClick={onClose}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="ion-text-center">
            <p>No access code available to share.</p>
          </div>
        </IonContent>
      </IonModal>
    );
  }

  // Safe access to accessCode properties with fallbacks
  const visitorName = accessCode.visitor_name || "Unknown Visitor";
  const code = accessCode.code || "N/A";
  const status = accessCode.status || "unknown";
  const createdAt = accessCode.created_at || new Date().toISOString();

  const remaining = calculateRemainingTime(createdAt, 30);

  const shareAsText = async () => {
    try {
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
          copyToClipboard(shareText);
        }
      } else {
        copyToClipboard(shareText);
      }
      onClose?.();
    } catch (error) {
      console.error("Error sharing as text:", error);
      onToast?.("Failed to share access code");
    }
  };

  const copyToClipboard = async (text: string) => {
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
  };

  const generateQRCode = async (): Promise<string> => {
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
  };

  const showQRCode = async () => {
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
  };

  const createShareImage = async (): Promise<string> => {
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

    let nextY = 225;
    if (status === "active" && remaining?.value && remaining.value > 0) {
      ctx.fillText(
        `Expires in: ${remaining.value} ${remaining.unit || "minutes"}`,
        leftSide / 2,
        nextY
      );
      nextY += 25;
    }

    ctx.fillText(`Created: ${formatDate(createdAt)}`, leftSide / 2, nextY);

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
  };

  const shareAsImage = async () => {
    try {
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
  };

  const downloadCode = async () => {
    try {
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
  };

  const getStatusColor = (status: string) => {
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

  const handleModalClose = () => {
    setActiveView("options");
    setQrCodeDataUrl("");
    onClose?.();
  };

  const goBackToOptions = () => {
    setActiveView("options");
    setQrCodeDataUrl("");
  };

  const formatStatus = (status: string) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleModalClose}>
      <IonHeader className="app-header">
        <IonToolbar>
          <IonTitle>
            {activeView === "options" ? "Share Access Code" : "QR Code"}
          </IonTitle>
          <IonButtons slot="start">
            {activeView === "qr" && (
              <IonButton fill="clear" onClick={goBackToOptions}>
                <IonIcon icon={arrowBack} />
              </IonButton>
            )}
          </IonButtons>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={handleModalClose}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding share-modal-content">
        {activeView === "options" && (
          <>
            {/* Preview Card */}
            <IonCard className="share-preview-card">
              <IonCardContent>
                <div className="code-header">
                  <h3 className="code-name">{visitorName}</h3>
                  <IonBadge
                    color={getStatusColor(status)}
                    className="status-badge"
                  >
                    {formatStatus(status)}
                  </IonBadge>
                </div>

                <div className="created-code-row">
                  <IonLabel>{formatDate(createdAt)}</IonLabel>
                  <IonLabel>
                    <strong>Code: {code}</strong>
                  </IonLabel>
                </div>

                {status === "active" &&
                  remaining?.value &&
                  remaining.value > 0 && (
                    <div className="expires-info">
                      <IonLabel>
                        Expires in {remaining.value}{" "}
                        {remaining.unit || "minutes"}
                      </IonLabel>
                    </div>
                  )}
              </IonCardContent>
            </IonCard>

            {/* Share Options */}
            <IonList className="share-options-list">
              <IonItem
                button
                onClick={shareAsText}
                className="share-option-item"
              >
                <IonIcon icon={shareOutline} slot="start" />
                <IonLabel>
                  <h2>Share as Text</h2>
                  <p>Share code details as text message</p>
                </IonLabel>
              </IonItem>

              <IonItem
                button
                onClick={showQRCode}
                disabled={isGeneratingQR}
                className="share-option-item"
              >
                <IonIcon icon={qrCodeOutline} slot="start" />
                <IonLabel>
                  <h2>Show QR Code</h2>
                  <p>Display QR code for scanning</p>
                </IonLabel>
                {isGeneratingQR && <IonSpinner slot="end" name="crescent" />}
              </IonItem>

              <IonItem
                button
                onClick={downloadCode}
                className="share-option-item"
              >
                <IonIcon icon={downloadOutline} slot="start" />
                <IonLabel>
                  <h2>Download</h2>
                  <p>Download code details as image</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </>
        )}

        {activeView === "qr" && (
          <div className="qr-code-view">
            {/* Code Details Card */}
            <IonCard className="qr-info-card">
              <IonCardContent className="ion-text-center">
                <h2>{visitorName}</h2>
                <p>
                  <strong>Code: {code}</strong>
                </p>
                <IonBadge
                  color={getStatusColor(status)}
                  className="status-badge"
                >
                  {formatStatus(status)}
                </IonBadge>
                {status === "active" &&
                  remaining?.value &&
                  remaining.value > 0 && (
                    <div className="expires-info">
                      <p>
                        Expires in {remaining.value}{" "}
                        {remaining.unit || "minutes"}
                      </p>
                    </div>
                  )}
              </IonCardContent>
            </IonCard>

            {/* QR Code Display */}
            <IonCard className="qr-card">
              <IonCardContent className="ion-text-center">
                <h3
                  style={{
                    color: "#004225",
                    fontWeight: "600",
                    margin: "0 0 16px 0",
                  }}
                >
                  Scan QR Code
                </h3>
                {qrCodeDataUrl && (
                  <div className="qr-code-container">
                    <img src={qrCodeDataUrl} alt="QR Code for access code" />
                  </div>
                )}
                <div className="qr-scan-instruction">
                  <p>Scan this QR code to access the code details</p>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Action Buttons */}
            <div className="qr-actions">
              <CustomButton onClick={shareAsText} className="share-button">
                <IonIcon icon={arrowRedoSharp} slot="start" />
                Share as Text
              </CustomButton>
            </div>
          </div>
        )}
      </IonContent>
    </IonModal>
  );
};

export default ShareModal;
