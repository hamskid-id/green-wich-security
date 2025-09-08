import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonText,
  IonToast,
  IonInputOtp,
} from "@ionic/react";
import { call, lockClosed, mail } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "./AuthPages.css";
import CustomInput from "../../components/ui/customInput/CustomInput";
import CustomButton from "../../components/ui/customButton/CustomButton";
import { useAuth } from "../../hooks/useAuth";

const ForgotPasswordPage: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastColor, setToastColor] = useState<
    "toast-success" | "toast-danger"
  >("toast-danger");

  const { requestPasswordReset, verifyResetCode, resetPassword, isLoading } =
    useAuth();

  const history = useHistory();

  // Check if input is email or phone
  const isEmail = contactInfo.includes("@");

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (verificationCode.length === 4 && step === 2) {
      handleVerifyCode();
    }
  }, [verificationCode, step]);

  const showToastMessage = (
    message: string,
    color: "toast-success" | "toast-danger"
  ) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const handleResetRequest = async (): Promise<void> => {
    if (!contactInfo.trim()) {
      showToastMessage("Please enter your email", "toast-danger");
      return;
    }

    try {
      await requestPasswordReset(contactInfo);
      setStep(2);
      showToastMessage("Verification code sent successfully", "toast-success");
    } catch (error: any) {
      showToastMessage(
        error.message || "Password reset request failed",
        "toast-danger"
      );
    }
  };

  const handleVerifyCode = async (): Promise<void> => {
    if (!verificationCode.trim() || verificationCode.length !== 4) {
      showToastMessage(
        "Please enter the complete 4-digit verification code",
        "toast-danger"
      );
      return;
    }

    try {
      await verifyResetCode(verificationCode, contactInfo);
      setStep(3);
      showToastMessage("Code verified successfully", "toast-success");
    } catch (error: any) {
      showToastMessage(
        error.message || "Invalid verification code",
        "toast-danger"
      );
      // Clear the code on error so user can re-enter
      setVerificationCode("");
    }
  };

  const handlePasswordReset = async (): Promise<void> => {
    if (newPassword !== confirmPassword) {
      showToastMessage("Passwords do not match", "toast-danger");
      return;
    }

    if (newPassword.length < 6) {
      showToastMessage(
        "Password must be at least 6 characters long",
        "toast-danger"
      );
      return;
    }

    try {
      await resetPassword(verificationCode, newPassword, contactInfo);
      showToastMessage(
        "Password reset successfully! Redirecting to login...",
        "toast-success"
      );
      setTimeout(() => history.push("/login"), 2000);
    } catch (error: any) {
      showToastMessage(
        error.message || "Password reset failed",
        "toast-danger"
      );
    }
  };

  const handleResendCode = async (): Promise<void> => {
    try {
      await requestPasswordReset(contactInfo);
      setVerificationCode(""); // Clear existing code
      showToastMessage(
        "Verification code resent successfully",
        "toast-success"
      );
    } catch (error: any) {
      showToastMessage(
        error.message || "Failed to resend verification code",
        "toast-danger"
      );
    }
  };

  const handleOtpInput = (value: string) => {
    setVerificationCode(value);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Reset Your Password";
      case 2:
        return "Verify Your Identity";
      case 3:
        return "Create New Password";
      default:
        return "Reset Your Password";
    }
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
            <p className="app-subtitle">{getStepTitle()}</p>
          </div>

          {/* Auth Tabs */}
          <div className="auth-tabs">
            <div className="auth-tab" onClick={() => history.push("/login")}>
              Login
            </div>
            <div className="auth-tab active">Reset Password</div>
          </div>

          {/* Form Content Based on Step */}
          <div className="auth-form">
            {step === 1 && (
              <>
                <div className="instruction-text">
                  <IonText color="medium">
                    Enter your email address to receive a verification code
                  </IonText>
                </div>
                <CustomInput
                  icon={isEmail ? mail : call}
                  type={isEmail ? "email" : "tel"}
                  value={contactInfo}
                  onIonInput={(e) => setContactInfo(e.detail.value!)}
                  placeholder="email@example.com"
                />

                <CustomButton
                  loading={isLoading}
                  disabled={!contactInfo.trim()}
                  onClick={handleResetRequest}
                >
                  Send Verification Code
                </CustomButton>
              </>
            )}

            {step === 2 && (
              <>
                <div className="instruction-text">
                  <IonText color="medium">
                    We've sent a 4-digit verification code to {contactInfo}. The
                    code will be submitted automatically when complete.
                  </IonText>
                </div>

                <div className="code-inputs-container">
                  <IonInputOtp
                    value={verificationCode}
                    onIonInput={(e) => handleOtpInput(e.detail.value!)}
                    className={`ion-touched has-focus ${
                      verificationCode.length === 4
                        ? "ion-valid"
                        : "ion-invalid"
                    }`}
                  >
                    Didn't get a code?{" "}
                    <span
                      className="resend-text"
                      onClick={handleResendCode}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      Resend the code
                    </span>
                  </IonInputOtp>
                </div>

                {/* Optional manual verify button for backup */}
                {verificationCode.length === 4 && (
                  <CustomButton
                    loading={isLoading}
                    onClick={handleVerifyCode}
                    style={{ marginTop: "1rem" }}
                  >
                    Verify Code Manually
                  </CustomButton>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <div className="instruction-text">
                  <IonText color="medium">
                    Create a new password for your account
                  </IonText>
                </div>

                <CustomInput
                  icon={lockClosed}
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onIonInput={(e) => setNewPassword(e.detail.value!)}
                  placeholder="Enter new password"
                />

                <CustomInput
                  icon={lockClosed}
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                  placeholder="Confirm new password"
                />

                <CustomButton
                  loading={isLoading}
                  disabled={!newPassword.trim() || !confirmPassword.trim()}
                  onClick={handlePasswordReset}
                >
                  Reset Password
                </CustomButton>
              </>
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

export default ForgotPasswordPage;
