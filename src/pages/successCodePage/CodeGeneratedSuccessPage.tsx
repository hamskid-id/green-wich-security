import React, { useState, useEffect, useMemo } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonButton,
  IonToast,
} from "@ionic/react";
import {
  checkmarkCircle,
  person,
  calendar,
  time,
  clipboard,
  arrowRedoSharp,
} from "ionicons/icons";
import CustomButton from "../../components/ui/customButton/CustomButton";
import "./CodeGeneratedSuccessPage.css";
import { useLocation, useHistory } from "react-router";
import { CodeData } from "../../types";
import {
  formatDate,
  formatTimeDisplay,
  formatTimeRemaining,
} from "../../utils/helpers";

interface LocationState {
  codeData: CodeData;
}

const CodeGeneratedSuccessPage: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const codeData = location.state?.codeData;

  // Calculate expiration time once on mount
  const expirationTime = useMemo(() => {
    if (!codeData) return null;

    // If we have startTime/endTime, use endTime as expiration
    if (codeData.end_time) {
      return new Date(codeData.end_time).getTime();
    }

    // Otherwise calculate based on expires_in
    if (codeData.expires_in) {
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + codeData.expires_in);
      return expiration.getTime();
    }

    return null;
  }, [codeData]);

  useEffect(() => {
    if (!expirationTime) return;

    const updateCountdown = () => {
      const now = Date.now();
      const difference = expirationTime - now;

      if (difference <= 0) {
        setTimeRemaining(0);
        setIsExpired(true);
        return;
      }

      setTimeRemaining(difference);
    };

    // Initial update
    updateCountdown();

    // Set up interval to update every second
    const interval = setInterval(updateCountdown, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [expirationTime]);

  // Determine what time information to display
  const getTimeDisplayText = () => {
    if (codeData?.start_time && codeData?.end_time) {
      return `${formatTimeDisplay(codeData.start_time)} - ${formatTimeDisplay(
        codeData.end_time
      )}`;
    }

    if (isExpired) {
      return "Expired";
    }

    if (timeRemaining > 0) {
      return `Expires in ${formatTimeRemaining(timeRemaining)}`;
    }

    return "No expiration time set";
  };

  const handleCopyCode = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(codeData.code);
      setShowCopyToast(true);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleShareCode = (): void => {
    const shareText = `Your visitor access code is: ${
      codeData.code
    }\nValid until: ${formatDate(
      new Date(codeData.expires_in).toISOString()
    )}\nGenerated for: ${codeData.visitor_name}`;

    if (navigator.share) {
      navigator.share({
        title: "Visitor Access Code",
        text: shareText,
      });
    } else {
      // Fallback - copy to clipboard
      handleCopyCode();
    }
  };

  const handleDone = (): void => {
    history.push("/home");
  };

  if (!codeData) {
    return (
      <IonPage>
        <IonHeader className="app-header">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/create-visitor-code" />
            </IonButtons>
            <IonTitle className="success-header-title">Error</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="success-container">
            <p>No code data found. Please go back and try again.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="app-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/create-visitor-code" />
          </IonButtons>
          <IonTitle className="success-header-title">Code Generated</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="success-container">
          <div className="success-icon-container">
            <IonIcon icon={checkmarkCircle} className="success-icon" />
          </div>

          <h2 className="success-title">Code Generated Successfully!</h2>
          <p className="success-subtitle">
            Your visitor access code is ready to use
          </p>

          <div className="visitor-code-display">
            <div className="code-label">Visitor Access Code</div>
            <div className="visitor-code">{codeData.code}</div>
            <IonButton
              fill="clear"
              size="small"
              onClick={handleCopyCode}
              className="copy-button"
            >
              <IonIcon icon={clipboard} slot="start" />
              Copy Code
            </IonButton>
          </div>

          <div className="visit-summary">
            <h3 className="summary-title">Visit Summary</h3>

            <IonItem className="summary-item" lines="none">
              <IonIcon icon={person} slot="start" className="summary-icon" />
              <IonLabel>
                <h4>Visitor Name</h4>
                <p>{codeData.visitor_name}</p>
              </IonLabel>
            </IonItem>

            {codeData?.purpose && (
              <IonItem className="summary-item" lines="none">
                <IonIcon
                  icon={calendar}
                  slot="start"
                  className="summary-icon"
                />
                <IonLabel>
                  <h4>Purpose</h4>
                  <p>{codeData.purpose}</p>
                </IonLabel>
              </IonItem>
            )}

            <IonItem className="summary-item" lines="none">
              <IonIcon icon={time} slot="start" className="summary-icon" />
              <IonLabel>
                <h4>Valid Time</h4>
                <p>{getTimeDisplayText()}</p>
              </IonLabel>
            </IonItem>

            <IonItem className="summary-item" lines="none">
              <IonLabel>
                <h4>Date Generated</h4>
                <p>{formatDate(codeData.created_at)}</p>
              </IonLabel>
            </IonItem>

            {codeData.notes && (
              <IonItem className="summary-item" lines="none">
                <IonLabel>
                  <h4>Additional Details</h4>
                  <p>{codeData.notes}</p>
                </IonLabel>
              </IonItem>
            )}
          </div>

          <div className="action-buttons">
            <CustomButton onClick={handleShareCode} className="share-button">
              <IonIcon icon={arrowRedoSharp} slot="start" />
              Share Code
            </CustomButton>
            <CustomButton onClick={handleDone} className="done-button">
              Done
            </CustomButton>
          </div>
        </div>

        <IonToast
          isOpen={showCopyToast}
          onDidDismiss={() => setShowCopyToast(false)}
          message="Code copied to clipboard!"
          duration={2000}
          cssClass="toast-success"
        />
      </IonContent>
    </IonPage>
  );
};

export default CodeGeneratedSuccessPage;
