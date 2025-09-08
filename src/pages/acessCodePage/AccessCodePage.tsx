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
  IonSpinner,
  IonText,
} from "@ionic/react";
import { person, calendar, time, clipboard } from "ionicons/icons";
import CustomButton from "../../components/ui/customButton/CustomButton";
import "./AccessCodePage.css";
import { useHistory, useParams } from "react-router-dom";
import { AccessCode } from "../../types";
import { formatDate, formatTimeRemaining } from "../../utils/helpers";
import { ApiResponse, useApi } from "../../hooks/useApi";

const AccessCodePage: React.FC = () => {
  const history = useHistory();
  const { code } = useParams<{ code: string }>();
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  // FIXED: Single useParams call
  const { useGet, usePost } = useApi();

  console.log("this is codes:", code);

  // FIXED: Added null check for code
  const { data, isError, error, isLoading } = useGet<ApiResponse<AccessCode>>(
    ["accessCode", code ?? ""],
    `/access-codes/get-by-code/${code}`,
    {
      enabled: !!code,
    }
  );

  const codeData = data?.data;

  // FIXED: Added null check for codeData?.id
  const { mutate: validateCode, isPending: isValidating } = usePost<void>(
    `/access-codes/validate/${codeData?.id}`
  );

  const handleValidateCode = async () => {
    try {
      const response = await validateCode(null);
      console.log(response);
      history.push("/verification-result", {
        success: true,
        visitorName: codeData?.visitor_name,
        accessCode: codeData?.code,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      history.push("/verification-result", { success: false });
    }
  };

  // Calculate expiration time once on mount
  const expirationTime = useMemo(() => {
    if (!codeData) return null;

    // Otherwise calculate based on expires_in
    if (codeData.expires_in) {
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + codeData.expires_in);
      return expiration.getTime();
    }

    return null;
  }, [codeData]);

  useEffect(() => {
    if (isError && error) {
      console.log(error);
      history.push("/verification-result", {
        success: false,
        error: error?.response?.data?.message,
      });
    }
  }, [isError, error, history]);

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
      if (codeData?.code) await navigator.clipboard.writeText(codeData?.code);
      setShowCopyToast(true);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

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
        <div className="view-container">
          <div className="success-container">
            {isLoading || isError ? (
              <div className="spinner-wrapper">
                <IonSpinner name="crescent" />
              </div>
            ) : (
              <>
                {/* Logo Section */}
                <div className="visitor-code-display">
                  <div className="code-label">Visitor Access Code</div>
                  <div className="visitor-code">{codeData?.code}</div>
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
                    <IonIcon
                      icon={person}
                      slot="start"
                      className="summary-icon"
                    />
                    <IonLabel>
                      <h4>Visitor Name</h4>
                      <p>{codeData?.visitor_name}</p>
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
                    <IonIcon
                      icon={time}
                      slot="start"
                      className="summary-icon"
                    />
                    <IonLabel>
                      <h4>Valid Time</h4>
                      <p>{getTimeDisplayText()}</p>
                    </IonLabel>
                  </IonItem>

                  <IonItem className="summary-item" lines="none">
                    <IonLabel>
                      <h4>Date Generated</h4>
                      <p>
                        {codeData?.created_at &&
                          formatDate(codeData?.created_at)}
                      </p>
                    </IonLabel>
                  </IonItem>
                  {codeData?.multiple_persons && (
                    <IonItem className="summary-item" lines="none">
                      <IonLabel>
                        <h4>Vistors Count</h4>
                        <p>{codeData?.visitor_count}</p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {codeData?.notes && (
                    <IonItem className="summary-item" lines="none">
                      <IonLabel>
                        <h4>Additional Details</h4>
                        <p>{codeData.notes}</p>
                      </IonLabel>
                    </IonItem>
                  )}
                </div>

                <div className="action-buttons">
                  <CustomButton
                    loading={isValidating}
                    onClick={handleValidateCode}
                    className="done-button"
                  >
                    Validate Code
                  </CustomButton>
                </div>
              </>
            )}
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
        {/* Copy Toast */}

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

export default AccessCodePage;
