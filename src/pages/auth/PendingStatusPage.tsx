import React from "react";
import { IonPage, IonContent, IonText, IonIcon, IonButton } from "@ionic/react";
import { timeOutline, arrowBackOutline } from "ionicons/icons";
import "./AuthPages.css";
import { useHistory } from "react-router";

const PendingStatusPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent className="auth-content">
        <div className="auth-container">
          {/* Back Button */}
          <div className="back-button">
            <IonButton
              fill="clear"
              color="medium"
              onClick={() => history.goBack()}
            >
              <IonIcon slot="start" icon={arrowBackOutline} />
              Back
            </IonButton>
          </div>

          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-circle">
              <img
                src="/div.png"
                alt="Greenwich Garden Estates Logo"
                className="logo-image"
              />
            </div>
            <h1 className="app-title">Greenwich Garden Estates</h1>
            <p className="app-subtitle">Account Review in Progress</p>

            {/* Pending Icon */}
            <div className={`status-icon pending`}>
              <IonIcon
                icon={timeOutline}
                className={`status-icon-svg pending`}
              />
            </div>
          </div>

          {/* Instruction */}
          <div className="auth-form">
            <div className="pending-text">
              <IonText color="medium">
                {`Your registration is currently under review. Once approved, you’ll receive a confirmation email with instructions to log in.`}
              </IonText>
            </div>

            <div className="support-link">
              <IonText color="medium">
                Need help?{" "}
                <IonText
                  color="primary"
                  onClick={() => history.push("/support")}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  Contact Support
                </IonText>
              </IonText>
            </div>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <IonText color="medium" className="copyright">
              © 2025 Greenwich Garden Estates. All rights reserved.
              <br />
              Version 1.0.0
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PendingStatusPage;
