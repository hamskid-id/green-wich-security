// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonToast,
  IonButton,
  IonIcon,
  IonSkeletonText,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import {
  personOutline,
  homeOutline,
  settingsOutline,
  refreshOutline,
} from "ionicons/icons";
import "./ProfilePage.css";
import { ProfileData } from "../../types";
import { ApiResponse, useApi } from "../../hooks/useApi";
import ProfileCard from "../../components/profilePage/ProfileCard";
import ProfileInfo from "../../components/profilePage/ProfileInfo";
import ProfileActions from "../../components/profilePage/ProfileActions";

const AppHeader: React.FC = () => (
  <IonHeader className="app-header">
    <IonToolbar>
      <IonButtons slot="start">
        <IonBackButton defaultHref="/home" />
      </IonButtons>
      <IonTitle className="create-header-title">Profile</IonTitle>
    </IonToolbar>
  </IonHeader>
);

const ProfilePage: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { useGet } = useApi();
  const { data, isError, error, isLoading, refetch } = useGet<
    ApiResponse<ProfileData>
  >(["userProfile"], `/profile`);

  const profileInformation = data?.data;

  // Handle pull-to-refresh
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch();
    event.detail.complete();
  }

  const getDisplayName = (): string => {
    if (!profileInformation) return "User";
    const firstName = profileInformation?.first_name || "";
    const lastName = profileInformation?.last_name || "";
    return `${firstName} ${lastName}`.trim() || "User";
  };

  // Error state
  if (error || isError) {
    return (
      <IonPage>
        <AppHeader />
        <IonContent className="ion-padding">
          <div className="error-state" role="alert">
            <div className="error-content">
              <h2>Unable to Load Profile</h2>
              <IonButton
                onClick={() => refetch()}
                color="primary"
                aria-label="Retry loading profile"
              >
                <IonIcon icon={refreshOutline} slot="start" />
                Try Again
              </IonButton>
            </div>
          </div>
        </IonContent>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
        />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader />

      <IonContent className="ion-padding profile-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon="chevron-down-circle-outline"
            pullingText="Pull to refresh profile"
            refreshingSpinner="circular"
            refreshingText="Updating..."
          />
        </IonRefresher>

        <main
          className="profile-main"
          role="main"
          aria-label="Profile page content"
        >
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar" aria-hidden="true">
              <IonIcon icon={personOutline} className="avatar-icon" />
            </div>
            <div className="profile-header-info">
              {isLoading ? (
                <>
                  <IonSkeletonText
                    animated
                    style={{ width: "60%", height: "28px" }}
                    aria-label="Loading name"
                  />
                  <IonSkeletonText
                    animated
                    style={{ width: "40%", height: "20px" }}
                    aria-label="Loading role"
                  />
                </>
              ) : (
                <>
                  <h1 className="profile-name">{getDisplayName()}</h1>
                  {profileInformation && (
                    <p className="profile-role">
                      {profileInformation?.role?.charAt(0).toUpperCase() +
                        profileInformation?.role?.slice(1)}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <ProfileCard
            title="Personal Information"
            icon={personOutline}
            className="profile-info-card"
            ariaLabel="Personal information section"
          >
            <ProfileInfo profile={profileInformation!} isLoading={isLoading} />
          </ProfileCard>

          {/* Unit Information */}
          {(profileInformation?.unit || isLoading) && (
            <ProfileCard
              title="Unit Information"
              icon={homeOutline}
              className="unit-info-card"
              ariaLabel="Unit and residence information section"
            >
              {isLoading ? (
                <div className="unit-loading">
                  <IonSkeletonText animated style={{ width: "100%" }} />
                  <IonSkeletonText animated style={{ width: "80%" }} />
                  <IonSkeletonText animated style={{ width: "60%" }} />
                </div>
              ) : (
                <div className="unit-info">
                  <div className="unit-details">
                    <h3 className="unit-name">
                      {profileInformation?.unit?.name}
                    </h3>
                    <p className="unit-residence">
                      {profileInformation?.unit?.residence?.name} -{" "}
                      {profileInformation?.unit?.type} #
                      {profileInformation?.unit?.number}
                    </p>
                  </div>
                </div>
              )}
            </ProfileCard>
          )}
          {/* Profile Actions */}
          <ProfileCard
            title="Account Actions"
            icon={settingsOutline}
            className="actions-card"
            ariaLabel="Account actions and settings section"
          >
            <ProfileActions />
          </ProfileCard>
        </main>
      </IonContent>

      {/* Toast for feedback */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
        color={error ? "danger" : "success"}
      />
    </IonPage>
  );
};

export default ProfilePage;
