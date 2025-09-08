import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonIcon, IonText } from "@ionic/react";
import { checkmarkCircle, alertCircle } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import "./VerifyResult.css";
import CustomButton from "../../components/ui/customButton/CustomButton";

interface LocationState {
  success: boolean;
  error?: string;
  visitorName?: string;
  timestamp?: string;
  accessCode?: string;
}

const VerificationResultPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [currentTime, setCurrentTime] = useState<string>("");

  // Get data from navigation state or default values
  const success = location.state?.success ?? true;
  const visitorName = location.state?.visitorName ?? "Visitor Name";
  const error =
    location.state?.error ??
    `Invalid or expired access code. Please contact the resident
                    or try again.`;
  const timestamp = location.state?.timestamp;

  useEffect(() => {
    // Set current timestamp if not provided
    const now = new Date();
    const timeString =
      timestamp ||
      now.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    setCurrentTime(timeString);
  }, [timestamp]);

  const handleBackToEntry = (): void => {
    history.replace("/verify-access-code");
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="view-container">
          <div className="result-container">
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
              <p className="app-subtitle">Visitor Access Management</p>
            </div>

            {/* Result Section */}
            <div className="result-section">
              <div className={`status-icon ${success ? "success" : "error"}`}>
                <IonIcon
                  icon={success ? checkmarkCircle : alertCircle}
                  className={`status-icon-svg ${success ? "success" : "error"}`}
                />
              </div>

              <div className="result-info">
                <h2 className="verification-result-visitor-name">
                  {visitorName} Checked In {success ? "Successfully" : "Failed"}
                </h2>
                <p className="timestamp">
                  {new Date(currentTime)?.toUTCString()}
                </p>
              </div>

              {!success && (
                <div className="error-details">
                  <p className="error-message">{error}</p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="action-buttons">
              <CustomButton
                onClick={handleBackToEntry}
                className="back-to-entry-button"
              >
                Back to Code Entry
              </CustomButton>
            </div>
          </div>
          {/* Footer */}
          <div className="view-footer">
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

export default VerificationResultPage;
