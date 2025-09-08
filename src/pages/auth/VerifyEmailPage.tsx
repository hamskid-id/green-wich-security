import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonText,
  IonToast,
  IonInputOtp,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import "./AuthPages.css";
import CustomButton from "../../components/ui/customButton/CustomButton";

interface LocationState {
  email?: string;
}

const VerifyEmailPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastColor, setToastColor] = useState<
    "toast-success" | "toast-danger"
  >("toast-danger");
  const [isResending, setIsResending] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  const { verifyEmail, resendVerificationCode, isLoading } = useAuthStore();
  const history = useHistory();
  const location = useLocation<LocationState>();

  // Set email from navigation state if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (verificationCode.length === 4) {
      handleVerifyEmail();
    }
  }, [verificationCode]);

  const showToastMessage = (
    message: string,
    color: "toast-success" | "toast-danger"
  ) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const handleVerifyEmail = async (): Promise<void> => {
    if (!email) {
      showToastMessage("Email address is required", "toast-danger");
      return;
    }

    if (!verificationCode.trim() || verificationCode.length !== 4) {
      showToastMessage(
        "Please enter the complete 4-digit verification code",
        "toast-danger"
      );
      return;
    }

    try {
      await verifyEmail(email, verificationCode);
      showToastMessage("Email verified successfully!", "toast-success");
      setTimeout(() => {
        history.push("/account-in-progress");
      }, 2000);
    } catch (error: any) {
      showToastMessage(
        error.message || "Email verification failed",
        "toast-danger"
      );
      // Clear the code on error so user can re-enter
      setVerificationCode("");
    }
  };

  const handleResendCode = async (): Promise<void> => {
    if (!email) {
      showToastMessage("Email address is required", "toast-danger");
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationCode(email);
      setVerificationCode("");
      showToastMessage("Verification code sent to your email", "toast-success");
      setCountdown(60); // 60 second countdown
    } catch (error: any) {
      showToastMessage(
        error.message || "Failed to resend verification code",
        "toast-danger"
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpInput = (value: string) => {
    setVerificationCode(value);
  };

  return (
    <IonPage>
      <IonContent className="auth-content">
        <div className="auth-container">
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
            <p className="app-subtitle">Verify Your Identity</p>
          </div>

          {/* Auth Tabs */}
          <div className="auth-tabs">
            <div className="auth-tab" onClick={() => history.push("/login")}>
              Login
            </div>
            <div className="auth-tab active">Verify Email</div>
          </div>

          {/* Form Content */}
          <div className="auth-form">
            <div className="instruction-text">
              <IonText color="medium">
                {email
                  ? `We've sent a 4-digit verification code to ${email}. The code will be submitted automatically when complete.`
                  : "We've sent a 4-digit verification code to your email. The code will be submitted automatically when complete."}
              </IonText>
            </div>

            <div className="code-inputs-container">
              <IonInputOtp
                value={verificationCode}
                onIonInput={(e) => handleOtpInput(e.detail.value!)}
                className={`ion-touched has-focus ${
                  verificationCode.length === 4 ? "ion-valid" : "ion-invalid"
                }`}
              >
                Didn't get a code?{" "}
                <span
                  className="resend-text"
                  onClick={handleResendCode}
                  style={{
                    cursor:
                      countdown > 0 || isResending ? "not-allowed" : "pointer",
                    textDecoration: "underline",
                    opacity: countdown > 0 || isResending ? 0.5 : 1,
                  }}
                >
                  {countdown > 0
                    ? `Resend in ${countdown}s`
                    : isResending
                    ? "Sending..."
                    : "Resend the code"}
                </span>
              </IonInputOtp>
            </div>

            {/* Optional manual verify button for backup */}
            {verificationCode.length === 4 && (
              <CustomButton
                loading={isLoading}
                onClick={handleVerifyEmail}
                style={{ marginTop: "1rem" }}
              >
                Verify Email Manually
              </CustomButton>
            )}

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

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          cssClass={toastColor}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default VerifyEmailPage;
