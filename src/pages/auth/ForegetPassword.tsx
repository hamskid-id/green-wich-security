import React, { useState } from "react";
import { IonPage, IonContent, IonText, IonToast } from "@ionic/react";
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

  // Using the useAuth hook instead of useAuthStore directly
  const { requestPasswordReset, verifyResetCode, resetPassword, isLoading } =
    useAuth();
  const history = useHistory();

  // Check if input is email or phone
  const isEmail = contactInfo.includes("@");

  const handleResetRequest = async (): Promise<void> => {
    if (!contactInfo.trim()) {
      setToastMessage("Please enter your email");
      setToastColor("toast-danger");
      setShowToast(true);
      return;
    }

    try {
      await requestPasswordReset(contactInfo);
      setStep(2);
      setToastMessage("Verification code sent successfully");
      setToastColor("toast-success");
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error.message || "Password reset request failed");
      setToastColor("toast-danger");
      setShowToast(true);
    }
  };

  const handleVerifyCode = async (): Promise<void> => {
    if (!verificationCode.trim()) {
      setToastMessage("Please enter the verification code");
      setToastColor("toast-danger");
      setShowToast(true);
      return;
    }

    try {
      await verifyResetCode(verificationCode, contactInfo);
      setStep(3);
      setToastMessage("Code verified successfully");
      setToastColor("toast-success");
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error.message || "Invalid verification code");
      setToastColor("toast-danger");
      setShowToast(true);
    }
  };

  const handlePasswordReset = async (): Promise<void> => {
    if (newPassword !== confirmPassword) {
      setToastMessage("Passwords do not match");
      setToastColor("toast-danger");
      setShowToast(true);
      return;
    }

    if (newPassword.length < 6) {
      setToastMessage("Password must be at least 6 characters long");
      setToastColor("toast-danger");
      setShowToast(true);
      return;
    }

    try {
      await resetPassword(verificationCode, newPassword, contactInfo);
      setToastMessage("Password reset successfully! Redirecting to login...");
      setToastColor("toast-success");
      setShowToast(true);
      setTimeout(() => history.push("/login"), 2000);
    } catch (error: any) {
      setToastMessage(error.message || "Password reset failed");
      setToastColor("toast-danger");
      setShowToast(true);
    }
  };

  const handleResendCode = async (): Promise<void> => {
    try {
      await requestPasswordReset(contactInfo);
      setToastMessage("Verification code resent successfully");
      setToastColor("toast-success");
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error.message || "Failed to resend verification code");
      setToastColor("toast-danger");
      setShowToast(true);
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
            <p className="app-subtitle">
              {step === 1
                ? "Reset Your Password"
                : step === 2
                ? "Verify Your Identity"
                : "Create New Password"}
            </p>
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
                  placeholder="email@example.com "
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
                <IonText color="medium" className="instruction-text">
                  Enter the verification code sent to{" "}
                  {isEmail ? "your email" : "your phone"}
                </IonText>

                <CustomInput
                  label="Verification Code"
                  type="text"
                  value={verificationCode}
                  onIonInput={(e) => setVerificationCode(e.detail.value!)}
                  placeholder="Enter verification code"
                />

                <div className="resend-code">
                  <IonText color="medium">Didn't receive the code?</IonText>
                  <IonText
                    color="primary"
                    className="resend-link"
                    onClick={handleResendCode}
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      marginLeft: "8px",
                    }}
                  >
                    Resend Code
                  </IonText>
                </div>

                <CustomButton
                  loading={isLoading}
                  disabled={!verificationCode.trim()}
                  onClick={handleVerifyCode}
                >
                  Verify Code
                </CustomButton>
              </>
            )}

            {step === 3 && (
              <>
                <IonText color="medium" className="instruction-text">
                  Create a new password for your account
                </IonText>

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
