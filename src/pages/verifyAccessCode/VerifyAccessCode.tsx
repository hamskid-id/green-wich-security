import React, { useState, useRef, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonToast,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonButton,
  IonTitle,
  IonModal,
  IonText,
} from "@ionic/react";
import {
  key,
  qrCodeOutline,
  close,
  logOutOutline,
  trash,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import "./VerifyAccessCode.css";
import CustomInput from "../../components/ui/customInput/CustomInput";
import CustomButton from "../../components/ui/customButton/CustomButton";
import jsQR from "jsqr";
import AlertModal from "../../components/ui/alertModal/AlertModal";

const VerifyAccessCodePage: React.FC = () => {
  const [accessCode, setAccessCode] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "danger">("success");
  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { logout } = useAuthStore();
  const history = useHistory();

  const showSuccessToast = (message: string): void => {
    setToastMessage(message);
    setToastType("success");
    setShowToast(true);
  };

  const showErrorToast = (message: string): void => {
    setToastMessage(message);
    setToastType("danger");
    setShowToast(true);
  };

  const handleLogout = (): void => {
    logout();
    history.replace("/login");
  };

  const handleValidateCode = async (accessCode: string): Promise<void> => {
    try {
      history.push(`/access-code`, {
        code: accessCode,
      });
    } catch (error: any) {
      // Navigate to failure result page
      history.push("/verification-result", {
        success: false,
        error: error?.response?.data?.message || error?.message,
        visitorName: "Visitor Name",
        accessCode: accessCode,
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      });
    }
  };

  const handleScanQR = (): void => {
    setIsQRModalOpen(true);
    startCamera();
  };

  const startCamera = async (): Promise<void> => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      showErrorToast("Unable to access camera. Please check permissions.");
      setIsScanning(false);
      setIsQRModalOpen(false);
    }
  };

  const stopCamera = (): void => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const closeQRModal = (): void => {
    stopCamera();
    setIsQRModalOpen(false);
  };

  // Simple QR detection function (basic implementation)
  const detectQRCode = (): void => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
      if (qrCode) {
        handleQRCodeDetected(qrCode.data);
        return;
      }
    } catch (error) {
      console.error("Error processing frame:", error);
    }

    // Continue scanning
    if (isScanning) {
      requestAnimationFrame(detectQRCode);
    }
  };

  const handleQRCodeDetected = (qrData: string): void => {
    stopCamera();
    setIsQRModalOpen(false);
    
    const extractedCode = extractAccessCodeFromQR(qrData);
    if (extractedCode) {
      setAccessCode(extractedCode);
      showSuccessToast("QR Code scanned successfully!");

      // Auto-validate after successful scan
      setTimeout(() => {
        handleValidateCode(extractedCode);
      }, 1000);
    } else {
      showErrorToast("Invalid QR code format");
    }
  };

  const extractAccessCodeFromQR = (qrData: string): string => {
    try {
      const parsed = JSON.parse(qrData);
      return parsed.code;
    } catch {
      // If QR contains plain text access code
      const match = qrData.match(/\d{6}/); // Extract 6-digit number
      return match ? match[0] : "";
    }
  };

  useEffect(() => {
    if (isScanning && videoRef.current?.readyState === 4) {
      detectQRCode();
    }
  }, [isScanning]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <IonPage>
      <IonHeader className="verify-app-header">
        <IonToolbar>
          <IonButton
            slot="start"
            fill="clear"
            routerLink="/home"
            aria-label="Go back to Home"
          >
            <img
              src="/guard-icon.png"
              alt="Greenwich Garden Estates Logo"
              className="guard-icon"
            />
          </IonButton>
          <div className="header-side-content">
            <IonTitle className="verify-page-header-title">
              Guard Verification
            </IonTitle>
          </div>
          <IonButton
            slot="end"
            fill="clear"
            onClick={() => setShowLogoutAlert(true)}
            aria-label="Logout"
            color="danger"
          >
            <IonIcon icon={logOutOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="view-container">
          <div className="verify-container">
            {/* Logo Section */}
            <div className="logo-section">
              <h1 className="app-title">Verify Access Code</h1>
              <p className="app-subtitle">Enter or scan visitor access code</p>
            </div>

            {/* Access Code Form */}
            <div className="verify-form">
              <CustomInput
                icon={key}
                label="Access Code"
                type="text"
                value={accessCode}
                onIonInput={(e) => setAccessCode(e.detail.value!)}
                placeholder="Enter 6-digit code"
              />

              <CustomButton
                loading={false}
                disabled={!accessCode}
                onClick={() => handleValidateCode(accessCode)}
              >
                Validate Code
              </CustomButton>

              {/* OR Separator */}
              <div className="or-separator">
                <span className="or-text">OR</span>
              </div>

              {/* QR Scanner Button */}
              <div className="action-buttons">
                <CustomButton className="share-button" onClick={handleScanQR}>
                  <IonIcon icon={qrCodeOutline} slot="start" />
                  Scan QR Code
                </CustomButton>
              </div>
            </div>
          </div>

          {/* QR Scanner Modal */}
          <IonModal isOpen={isQRModalOpen} onDidDismiss={closeQRModal}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Scan QR Code</IonTitle>
                <IonButton
                  slot="end"
                  fill="clear"
                  onClick={closeQRModal}
                  aria-label="Close QR Scanner"
                >
                  <IonIcon icon={close} />
                </IonButton>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <div className="qr-scanner-container">
                <div className="camera-view">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="camera-video"
                    onLoadedData={() => {
                      if (isScanning) detectQRCode();
                    }}
                  />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <div className="scanner-overlay">
                    <div className="scanner-frame"></div>
                  </div>
                </div>
                <div className="scanner-instructions">
                  <p>Point your camera at the QR code</p>
                  <p>Make sure the code is clearly visible</p>
                </div>
              </div>
            </IonContent>
          </IonModal>
          {/* Footer */}
          <div className="view-footer">
            <IonText color="medium" className="copyright">
              © 2025 Greenwich Garden Estates. All rights reserved.
              <br />
              Version 1.0.0
            </IonText>
          </div>
        </div>
        <AlertModal
          isOpen={showLogoutAlert}
          onClose={() => setShowLogoutAlert(false)}
          onConfirm={handleLogout}
          title="Sign Out"
          message="Are you sure you want to sign out of your account?"
          confirmText="Yes, Sign Out"
          cancelText="Cancel"
          type="danger"
          confirmIcon={trash}
          cancelIcon={close}
        />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          cssClass={`toast-${toastType}`}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default VerifyAccessCodePage;
