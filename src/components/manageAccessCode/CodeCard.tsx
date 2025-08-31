import React from "react";
import {
  IonCard,
  IonCardContent,
  IonBadge,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { arrowRedoSharp, trashOutline } from "ionicons/icons";
import { AccessCode } from "../../types";
import { formatDate } from "../../utils/helpers";

interface Props {
  code: AccessCode & { remaining?: { value: number; unit: string } };
  onShare: (code: AccessCode) => void;
  onDelete: (code: AccessCode) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
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

const CodeCard: React.FC<Props> = ({ code, onShare, onDelete }) => {
  const isActive = code.status === "active" && code.remaining?.value! > 0;

  return (
    <IonCard className="code-card">
      <IonCardContent>
        <div className="code-header">
          <h3 className="code-name">{code.visitor_name}</h3>
          <div className="code-actions">
            <button
              className={`action-button share ${!isActive ? "disabled" : ""}`}
              aria-label={`Share code for ${code.visitor_name}`}
              onClick={() => onShare(code)}
              disabled={!isActive}
            >
              <IonIcon icon={arrowRedoSharp} />
            </button>
            <button
              className={`action-button delete ${!isActive ? "disabled" : ""}`}
              aria-label={`Delete code for ${code.visitor_name}`}
              onClick={() => onDelete(code)}
              disabled={!isActive}
            >
              <IonIcon icon={trashOutline} />
            </button>
          </div>
        </div>

        <div className="status-row">
          <IonBadge
            color={getStatusColor(code.status)}
            className="status-badge"
          >
            {code.status.charAt(0).toUpperCase() + code.status.slice(1)}
          </IonBadge>
          {code.status === "active" && (
            <IonLabel color={code.remaining?.value! <= 0 ? "danger" : "dark"}>
              {code.remaining?.value! > 0
                ? `Expires in ${code.remaining?.value} ${code.remaining?.unit}`
                : "Expired"}
            </IonLabel>
          )}
        </div>

        <div className="created-code-row">
          <IonLabel>{formatDate(code.created_at)}</IonLabel>
          <IonLabel>
            <strong>Code: {code.code}</strong>
          </IonLabel>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default CodeCard;
