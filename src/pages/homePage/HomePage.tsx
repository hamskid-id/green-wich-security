// src/pages/HomePage.tsx
import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonBadge,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import {
  notificationsOutline,
  chevronForward,
} from "ionicons/icons";
import "./HomePage.css";
import { useResponsive } from "../../hooks/useResponsive";
import { useHistory } from "react-router";

const HomePage: React.FC = () => {
  const { isDesktop } = useResponsive();
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader className="app-header">
        <IonToolbar>
          <IonTitle>
            <div className="header-content">
              <h1 className="header-title">Greenwich</h1>
              <p className="header-subtitle">Resident Portal</p>
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/notifications" className="notification-btn">
              <IonIcon icon={notificationsOutline} />
              <IonBadge
                color="success"
                className="notification-badge"
              ></IonBadge>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="welcome-section">
          <h1>Welcome, Sarah</h1>
          <p>What would you like to do today?</p>
        </div>

        <div className="action-grid">
          {/* Generate Visitor Code Card */}
          <IonCard
            className="action-card"
            button
            routerLink="/create-visitor-code"
          >
            <IonCardContent className="card-content-wrapper">
              <div className="action-icon">
                <img
                  src="/div.svg"
                  alt="Greenwich Garden Estates Logo"
                  className="logo-image"
                />
              </div>
              <div className="card-text-content">
                <IonCardTitle>Generate Visitor Code</IonCardTitle>
                <p className="card-description">
                  Create a secure access code for visitors
                </p>
              </div>
              <IonIcon
                icon={chevronForward}
                color="medium"
                className="card-arrow"
              />
            </IonCardContent>
          </IonCard>

          {/* View Visitor History Card */}
          <IonCard className="action-card" button routerLink="/history-logs">
            <IonCardContent className="card-content-wrapper">
              <div className="action-icon">
                <img
                  src="/div (1).svg"
                  alt="Greenwich Garden Estates Logo"
                  className="logo-image"
                />
              </div>
              <div className="card-text-content">
                <IonCardTitle>View Visitor History</IonCardTitle>
                <p className="card-description">
                  See past and upcoming visitors
                </p>
              </div>
              <IonIcon
                icon={chevronForward}
                color="medium"
                className="card-arrow"
              />
            </IonCardContent>
          </IonCard>

          {/* Quick Stats Section */}
          <IonCard className="action-card">
            <IonCardHeader>
              <IonCardTitle className="stat-card-title">
                Quick Stats
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid className="stats-grid">
                <IonRow className="stats-row">
                  <IonCol className="stat-col">
                    <div className="stat-box">
                      <div className="stat-number">3</div>
                      <div className="stat-label">Active Codes</div>
                    </div>
                  </IonCol>
                  <IonCol className="stat-col">
                    <div className="stat-box">
                      <div className="stat-number">12</div>
                      <div className="stat-label">Visitors This Month</div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          <IonCard className="action-card">
            <IonCardHeader>
              <IonCardTitle className="stat-card-title">
                Recent Activity
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="activity-card">
              <IonItem lines="none">
                <div className="recent-icon">
                  <img
                    src="/div (2).svg"
                    alt="Greenwich Garden Estates Logo"
                    className="logo-image"
                  />
                </div>
                <IonLabel>
                  <h3>John Smith checked in</h3>
                  <p>Today, 2:35 PM</p>
                </IonLabel>
              </IonItem>
              <IonItem lines="none">
                <div className="recent-icon">
                  <img
                    src="/div (3).svg"
                    alt="Greenwich Garden Estates Logo"
                    className="logo-image"
                  />
                </div>
                <IonLabel>
                  <h3>Code generated for Amazon</h3>
                  <p>Today, 10:30 AM</p>
                </IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
