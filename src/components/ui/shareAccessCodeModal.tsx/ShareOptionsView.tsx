import React from "react";
import {
  IonCard,
  IonCardContent,
  IonLabel,
  IonBadge,
  IonList,
  IonItem,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { shareOutline, downloadOutline, qrCodeOutline } from "ionicons/icons";
import { AccessCode } from "../../../types";
import { calculateRemainingTime, formatDate } from "../../../utils/helpers";
import { ShareActions } from "../../../hooks/useShareActions";

interface ShareOptionsViewProps {
  accessCode: AccessCode;
  shareActions: ShareActions;
  isGeneratingQR: boolean;
}

const ShareOptionsView: React.FC<ShareOptionsViewProps> = ({
  accessCode,
  shareActions,
  isGeneratingQR,
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
    <>
      {/* Preview Card */}
      <IonCard className="share-preview-card">
        <IonCardContent>
          <div className="code-header">
            <h3 className="code-name">{visitorName}</h3>
            <IonBadge color={getStatusColor(status)} className="status-badge">
              {formatStatus(status)}
            </IonBadge>
          </div>

          <div className="created-code-row">
            <IonLabel>{formatDate(createdAt)}</IonLabel>
            <IonLabel>
              <strong>Code: {code}</strong>
            </IonLabel>
          </div>

          {status === "active" && remaining?.value && remaining.value > 0 && (
            <div className="expires-info">
              <IonLabel>
                Expires in {remaining.value} {remaining.unit || "minutes"}
              </IonLabel>
            </div>
          )}
        </IonCardContent>
      </IonCard>

      {/* Share Options */}
      <IonList className="share-options-list">
        <IonItem
          button
          onClick={shareActions.shareAsText}
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
          onClick={shareActions.showQRCode}
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
          onClick={shareActions.downloadCode}
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
  );
};

export default ShareOptionsView;
