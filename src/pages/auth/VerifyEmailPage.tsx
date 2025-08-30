import React, { useState, useRef, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonText,
  IonToast,
  IonIcon,
  IonButton,
  IonInput,
} from "@ionic/react";
import { mail, arrowBack } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import "./AuthPages.css";
import CustomInput from "../../components/ui/customInput/CustomInput";
import CustomButton from "../../components/ui/customButton/CustomButton";

interface LocationState {
  email?: string;
}

const VerifyEmailPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
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

  const codeInputRefs = useRef<Array<HTMLIonInputElement | null>>([]);

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

  const handleVerifyEmail = async (): Promise<void> => {
    if (!email || !code) {
      setToastMessage("Please enter both email and verification code");
      setToastColor("toast-danger");
      setShowToast(true);
      return;
    }

    if (code.length !== 4) {
      setToastMessage("Verification code must be 4 digits");
      setToastColor("toast-danger");
      setShowToast(true);
      return;
    }

    try {
      await verifyEmail(email, code);
      setToastMessage("Email verified successfully!");
      setToastColor("toast-success");
      setShowToast(true);

      // Redirect to login or dashboard after successful verification
      setTimeout(() => {
        history.push("/login");
      }, 1500);
    } catch (error: any) {
      setToastMessage(error.message || "Email verification failed");
      setToastColor("toast-danger");
      setShowToast(true);
    }
  };

  const handleResendCode = async (): Promise<void> => {
    if (!email) {
      setToastMessage("Please enter your email address");
      setToastColor("toast-danger");
      setShowToast(true);
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationCode(email);
      setToastMessage("Verification code sent to your email");
      setToastColor("toast-success");
      setShowToast(true);
      setCountdown(60); // 60 second countdown
    } catch (error: any) {
      setToastMessage(error.message || "Failed to resend verification code");
      setToastColor("toast-danger");
      setShowToast(true);
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    // Only allow numeric input and limit to 1 character
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 1);

    // Update the code
    const newCode = code.split("");
    newCode[index] = numericValue;
    setCode(newCode.join("").slice(0, 4));

    // Auto-focus next input if current is filled
    if (numericValue && index < 3) {
      const nextInput = codeInputRefs.current[index + 1];
      if (nextInput) {
        nextInput.setFocus();
      }
    }
  };

  const handleKeyDown = (event: any, index: number) => {
    // Handle backspace to go to previous input
    if (event.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = codeInputRefs.current[index - 1];
      if (prevInput) {
        prevInput.setFocus();
      }
    }
  };

  const isFormValid = email && code.length === 4;

  return (
    <IonPage>
      <IonContent className="auth-content">
        <div className="auth-container">
          {/* Back Button */}
          <div className="back-button-container">
            <IonButton
              fill="clear"
              onClick={() => history.goBack()}
              className="back-button"
            >
              <IonIcon icon={arrowBack} />
            </IonButton>
          </div>

          {/* Logo Section */}
          <div className="logo-section">
            <div className="verification-icon-container">
              <IonIcon icon={mail} className="verification-icon" />
            </div>
            <h1 className="verification-title">Verify Your Email</h1>
            <p className="verification-subtitle">
              We've sent a 4-digit verification code to your email address.
              Please enter the code below to verify your account.
            </p>
          </div>

          {/* Verification Form */}
          <div className="auth-form verification-form">
            <CustomInput
              icon={mail}
              label="Email Address"
              type="email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
              placeholder="Enter your email address"
              readonly={!!location.state?.email}
            />

            <div className="verification-code-section">
              <label className="code-label">Verification Code</label>
              <div className="code-inputs-container">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="code-input-wrapper">
                    <IonInput
                      ref={(el) => {
                        codeInputRefs.current[index] = el;
                      }}
                      type="tel"
                      maxlength={1}
                      value={code[index] || ""}
                      onIonInput={(e) =>
                        handleCodeChange(e.detail.value!, index)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="code-input"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <CustomButton
              loading={isLoading}
              disabled={!isFormValid}
              onClick={handleVerifyEmail}
              className="verify-button"
            >
              Verify Email
            </CustomButton>

            {/* Resend Code Section */}
            <div className="resend-section">
              <IonText color="medium" className="resend-text">
                Didn't receive the code?
              </IonText>
              <IonButton
                fill="clear"
                size="small"
                onClick={handleResendCode}
                disabled={countdown > 0 || isResending}
                className="resend-button"
              >
                {countdown > 0
                  ? `Resend in ${countdown}s`
                  : isResending
                  ? "Sending..."
                  : "Resend Code"}
              </IonButton>
            </div>

            {/* Support Link */}
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
