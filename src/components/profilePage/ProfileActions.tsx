import React, { useState } from "react";
import {
  IonButton,
  IonIcon,
  IonAlert,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import {
  logOutOutline,
  createOutline,
  shieldCheckmarkOutline,
  settingsOutline,
  helpCircleOutline,
  trash,
  close,
} from "ionicons/icons";
import { useAuthStore } from "../../stores/authStore";
import AlertModal from "../ui/alertModal/AlertModal";

interface ProfileActionsProps {
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  className?: string;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  onEditProfile,
  onChangePassword,
  onSettings,
  onHelp,
  className = "",
}) => {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      window.location.href = "/login";
      setIsLoggingOut(false);
      setShowLogoutAlert(false);
    }
  };

  //   const actionItems = [
  //     {
  //       id: "edit-profile",
  //       label: "Edit Profile",
  //       icon: createOutline,
  //       onClick: onEditProfile,
  //       ariaLabel: "Edit your profile information",
  //       available: !!onEditProfile,
  //     },
  //     {
  //       id: "change-password",
  //       label: "Change Password",
  //       icon: shieldCheckmarkOutline,
  //       onClick: onChangePassword,
  //       ariaLabel: "Change your account password",
  //       available: !!onChangePassword,
  //     },
  //     {
  //       id: "settings",
  //       label: "Settings",
  //       icon: settingsOutline,
  //       onClick: onSettings,
  //       ariaLabel: "Access application settings",
  //       available: !!onSettings,
  //     },
  //     {
  //       id: "help",
  //       label: "Help & Support",
  //       icon: helpCircleOutline,
  //       onClick: onHelp,
  //       ariaLabel: "Get help and support",
  //       available: !!onHelp,
  //     },
  //   ];

  return (
    <div className={`profile-actions ${className}`}>
      {/* Action Items */}
      {/* <IonList className="action-list" role="menu" aria-label="Profile actions">
        {actionItems
          .filter((item) => item.available)
          .map((item) => (
            <IonItem
              key={item.id}
              button
              onClick={item.onClick}
              className="action-item"
              role="menuitem"
              aria-label={item.ariaLabel}
            >
              <IonIcon
                icon={item.icon}
                slot="start"
                className="action-icon"
                aria-hidden="true"
              />
              <IonLabel className="action-label">{item.label}</IonLabel>
            </IonItem>
          ))}
      </IonList> */}

      {/* Logout Section */}
      <div className="logout-section">
        <IonButton
          expand="block"
          fill="outline"
          color="danger"
          onClick={() => setShowLogoutAlert(true)}
          disabled={isLoggingOut}
          className="logout-button"
          aria-label="Sign out of your account"
        >
          {isLoggingOut ? (
            <>
              <IonSpinner name="crescent" className="logout-spinner" />
              <span className="logout-text">Signing out...</span>
            </>
          ) : (
            <>
              <IonIcon icon={logOutOutline} slot="start" aria-hidden="true" />
              <span className="logout-text">Sign Out</span>
            </>
          )}
        </IonButton>
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
    </div>
  );
};

export default ProfileActions;
