import React from "react";
import { IonCard, IonCardContent, IonBadge, IonIcon } from "@ionic/react";
import { arrowRedoSharp } from "ionicons/icons";
import { AccessCode } from "../../../types";
import { calculateRemainingTime } from "../../../utils/helpers";
import CustomButton from "../customButton/CustomButton";
import { ShareActions } from "../../../hooks/useShareActions";

interface QRCodeViewProps {
  accessCode: AccessCode;
  qrCodeDataUrl: string;
  shareActions: ShareActions;
}

const QRCodeView: React.FC<QRCodeViewProps> = ({
  accessCode,
  qrCodeDataUrl,
  shareActions,
}) => {
  const visitorName = accessCode.visitor_name || "Unknown Visitor";
  const code = accessCode.code || "N/A";
  const status = accessCode.status || "unknown";
  const createdAt = accessCode.created_at || new Date().toISOString();

  const remaining = calculateRemainingTime(createdAt, 30);

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

  const formatStatus = (status: string) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="qr-code-view">
      {/* Code Details Card */}
      <IonCard className="qr-info-card">
        <IonCardContent className="ion-text-center">
          <h2>{visitorName}</h2>
          <p>
            <strong>Code: {code}</strong>
          </p>
          <IonBadge color={getStatusColor(status)} className="status-badge">
            {formatStatus(status)}
          </IonBadge>
          {status === "active" && remaining?.value && remaining.value > 0 && (
            <div className="expires-info">
              <p>
                Expires in {remaining.value} {remaining.unit || "minutes"}
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
        <CustomButton
          onClick={shareActions.shareAsText}
          className="share-button"
        >
          <IonIcon icon={arrowRedoSharp} slot="start" />
          Share as Text
        </CustomButton>
      </div>
    </div>
  );
};

export default QRCodeView;
