// src/components/AlertModal.tsx
import React from "react";
import {
  IonModal,
  IonContent,
  IonButton,
  IonIcon,
  IonBackdrop,
} from "@ionic/react";
import {
  warning,
  trash,
  close,
  checkmark,
  alertCircle,
  informationCircle,
} from "ionicons/icons";
import "./AlertModal.css";

export type AlertType = "warning" | "danger" | "success" | "info";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: AlertType;
  confirmIcon?: string;
  cancelIcon?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  confirmIcon,
  cancelIcon,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getAlertIcon = () => {
    switch (type) {
      case "danger":
        return warning;
      case "warning":
        return alertCircle;
      case "success":
        return checkmark;
      case "info":
        return informationCircle;
      default:
        return warning;
    }
  };

  const getAlertConfig = () => {
    switch (type) {
      case "danger":
        return {
          iconBg: "#FEF2F2",
          iconColor: "#EF4444",
          confirmBg: "#EF4444",
          confirmHover: "#DC2626",
        };
      case "warning":
        return {
          iconBg: "#FFFBEB",
          iconColor: "#F59E0B",
          confirmBg: "#F59E0B",
          confirmHover: "#D97706",
        };
      case "success":
        return {
          iconBg: "#F0FDF4",
          iconColor: "#10B981",
          confirmBg: "#10B981",
          confirmHover: "#059669",
        };
      case "info":
        return {
          iconBg: "#EFF6FF",
          iconColor: "#3B82F6",
          confirmBg: "#3B82F6",
          confirmHover: "#2563EB",
        };
      default:
        return {
          iconBg: "#FEF2F2",
          iconColor: "#EF4444",
          confirmBg: "#EF4444",
          confirmHover: "#DC2626",
        };
    }
  };

  const config = getAlertConfig();

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className={`alert-modal alert-modal-${type}`}
      backdropDismiss={true}
      showBackdrop={true}
    >
      <div className="modal-backdrop">
        <div className="modal-container">
          {/* Alert Icon */}
          <div className="alert-icon-container">
            <div
              className="alert-icon-bg"
              style={{ backgroundColor: config.iconBg }}
            >
              <IonIcon
                icon={getAlertIcon()}
                className="alert-icon"
                style={{ color: config.iconColor }}
              />
            </div>
          </div>

          {/* Modal Content */}
          <div className="modal-content">
            <h2 className="modal-title">{title}</h2>
            <p className="modal-message">{message}</p>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              className="confirm-button"
              onClick={handleConfirm}
              style={
                {
                  backgroundColor: config.confirmBg,
                  "--hover-bg": config.confirmHover,
                } as React.CSSProperties
              }
            >
              {confirmIcon && (
                <IonIcon icon={confirmIcon} className="button-icon" />
              )}
              {confirmText}
            </button>

            <button className="cancel-button" onClick={onClose}>
              {cancelIcon && (
                <IonIcon icon={cancelIcon} className="button-icon" />
              )}
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </IonModal>
  );
};

export default AlertModal; // src/components/RevokeCodeModal.tsx

