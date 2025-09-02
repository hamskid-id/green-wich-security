import React, { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonButtons,
} from "@ionic/react";
import { close, arrowBack } from "ionicons/icons";
import "./ShareAccessCodeModal.css";
import { AccessCode } from "../../../types";
import ShareOptionsView from "./ShareOptionsView";
import QRCodeView from "./QRCodeView";
import { useShareActions } from "../../../hooks/useShareActions";

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

  const shareActions = useShareActions({
    accessCode,
    onToast,
    onClose,
    setQrCodeDataUrl,
    setActiveView,
    setIsGeneratingQR,
  });

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

  const handleModalClose = () => {
    setActiveView("options");
    setQrCodeDataUrl("");
    onClose();
  };

  const goBackToOptions = () => {
    setActiveView("options");
    setQrCodeDataUrl("");
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
          <ShareOptionsView
            accessCode={accessCode}
            shareActions={shareActions}
            isGeneratingQR={isGeneratingQR}
          />
        )}

        {activeView === "qr" && (
          <QRCodeView
            accessCode={accessCode}
            qrCodeDataUrl={qrCodeDataUrl}
            shareActions={shareActions}
          />
        )}
      </IonContent>
    </IonModal>
  );
};

export default ShareModal;
