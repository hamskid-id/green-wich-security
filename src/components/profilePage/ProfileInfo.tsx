import React from "react";
import { IonItem, IonLabel, IonBadge, IonList } from "@ionic/react";
import { ProfileData } from "../../types";

interface ProfileInfoProps {
  profile: ProfileData;
  isLoading?: boolean;
}

interface InfoItemProps {
  label: string;
  value: string | React.ReactNode;
  ariaLabel?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, ariaLabel }) => (
  <IonItem lines="none" className="profile-info-item">
    <IonLabel>
      <div className="info-item-content">
        <dt className="info-label">{label}</dt>
        <dd
          className="info-value"
          aria-label={ariaLabel || `${label}: ${value}`}
        >
          {value}
        </dd>
      </div>
    </IonLabel>
  </IonItem>
);

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  isLoading = false,
}) => {
  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "medium";
      case "suspended":
        return "danger";
      default:
        return "primary";
    }
  };

  const getRoleDisplay = (role: string): string => {
    return role?.charAt(0).toUpperCase() + role?.slice(1) || "Unknown";
  };

  const formatName = (firstName?: string, lastName?: string): string => {
    const first = firstName || "";
    const last = lastName || "";
    return `${first} ${last}`.trim() || "Unknown User";
  };

  const formatPhone = (phone?: string): string => {
    if (!phone) return "Not provided";

    // Basic phone formatting for Nigerian numbers
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("0")) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
        7
      )}`;
    }
    return phone;
  };

  if (isLoading) {
    return (
      <div
        className="profile-info-loading"
        role="status"
        aria-label="Loading profile information"
      >
        <div className="loading-skeleton">
          <div className="skeleton-item large"></div>
          <div className="skeleton-item medium"></div>
          <div className="skeleton-item small"></div>
        </div>
      </div>
    );
  }

  return (
    <IonList className="profile-info-list" role="list">
      <InfoItem
        label="Full Name"
        value={formatName(profile.first_name, profile.last_name)}
        ariaLabel={`Full name: ${formatName(
          profile.first_name,
          profile.last_name
        )}`}
      />

      <InfoItem
        label="Email Address"
        value={
          <a
            href={`mailto:${profile.email}`}
            className="email-link"
            aria-label={`Send email to ${profile.email}`}
          >
            {profile.email || "Not provided"}
          </a>
        }
      />

      <InfoItem
        label="Phone Number"
        value={
          profile.phone ? (
            <a
              href={`tel:${profile.phone}`}
              className="phone-link"
              aria-label={`Call ${formatPhone(profile.phone)}`}
            >
              {formatPhone(profile.phone)}
            </a>
          ) : (
            "Not provided"
          )
        }
      />

      <InfoItem label="Role" value={getRoleDisplay(profile.role)} />

      <InfoItem
        label="Account Status"
        value={
          <IonBadge
            color={getStatusColor(profile.status)}
            className="status-badge"
            aria-label={`Account status: ${profile.status}`}
          >
            {profile.status?.charAt(0).toUpperCase() + profile.status?.slice(1)}
          </IonBadge>
        }
      />

      <InfoItem
        label="Unit"
        value={profile.unit?.name || "Not assigned"}
        ariaLabel={`Unit: ${profile.unit?.name || "Not assigned"}`}
      />

      <InfoItem
        label="Unit Type"
        value={
          profile.unit?.type?.charAt(0).toUpperCase() +
            profile.unit?.type?.slice(1) || "Not specified"
        }
      />

      <InfoItem
        label="Unit Number"
        value={profile.unit?.number?.toString() || "Not assigned"}
      />

      <InfoItem
        label="Residence"
        value={profile.unit?.residence?.name || "Not assigned"}
        ariaLabel={`Residence: ${
          profile.unit?.residence?.name || "Not assigned"
        }`}
      />
    </IonList>
  );
};

export default ProfileInfo;
