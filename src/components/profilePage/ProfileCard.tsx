import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
} from "@ionic/react";

interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  className?: string;
  ariaLabel?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  title,
  children,
  icon,
  className = "",
  ariaLabel,
}) => {
  return (
    <IonCard
      className={`profile-card ${className}`}
      role="region"
      aria-label={ariaLabel || `${title} section`}
    >
      <IonCardHeader className="profile-card-header">
        <div className="profile-card-title-wrapper">
          {icon && (
            <IonIcon
              icon={icon}
              className="profile-card-icon"
              aria-hidden="true"
            />
          )}
          <IonCardTitle
            className="profile-card-title"
            id={`${title.toLowerCase().replace(/\s+/g, "-")}-heading`}
          >
            {title}
          </IonCardTitle>
        </div>
      </IonCardHeader>
      <IonCardContent
        className="profile-card-content"
        role="group"
        aria-labelledby={`${title.toLowerCase().replace(/\s+/g, "-")}-heading`}
      >
        {children}
      </IonCardContent>
    </IonCard>
  );
};

export default ProfileCard;
