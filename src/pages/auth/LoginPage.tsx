import React, { useState } from "react";
import { IonPage, IonContent, IonText, IonToast } from "@ionic/react";
import { lockClosed, person } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import "./AuthPages.css";
import CustomInput from "../../components/ui/customInput/CustomInput";
import CustomButton from "../../components/ui/customButton/CustomButton";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const { login, isLoading } = useAuthStore();
  const history = useHistory();

  const handleLogin = async (): Promise<void> => {
    try {
      await login({ email: email, password: password });
      history.push("/verify-acess-codes");
    } catch (error: any) {
      setToastMessage(error.message || "Login failed");
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
            <p className="app-subtitle">Security Access Portal</p>
          </div>

          {/* Login Form */}
          <div className="auth-form">
            <div className="title-section">
              <h2 className="page-title">Security Login</h2>
              <p>Enter your credentials to access the guard portal</p>
            </div>
            <CustomInput
              icon={person}
              label="Email"
              type="email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
              placeholder="john doe@gmail.com"
            />

            <div className="password-section">
              <div className="password-label-row">
                <span className="password-label">Password</span>
                <IonText
                  color="primary"
                  className="forgot-password-link"
                  onClick={() => history.push("/forgot-password")}
                >
                  Forgot Password?
                </IonText>
              </div>
              <CustomInput
                icon={lockClosed}
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                placeholder="Enter your password"
              />
            </div>

            <CustomButton
              loading={isLoading}
              disabled={!email || !password}
              onClick={handleLogin}
            >
              Login
            </CustomButton>

            <div className="support-link">
              <IonText color="medium">Need help? Contact support</IonText>
            </div>
            <div className="heads-up">
              <div className="warning-row">
                <img
                  src="/security-reminder.png"
                  alt="Greenwich Garden Estates Logo"
                  className="security-image"
                />
                <IonText color="medium" className="warning-text-title">
                  Security Reminder:
                </IonText>
              </div>
              <div className="warning-row">
                <img
                  src="/check.png"
                  alt="Greenwich Garden Estates Logo"
                  className="logo-image"
                />
                <IonText color="medium" className="warning-text">
                  Never share your login credentials with anyone
                </IonText>
              </div>
              <div className="warning-row">
                <img
                  src="/check.png"
                  alt="Greenwich Garden Estates Logo"
                  className="logo-image"
                />
                <IonText color="medium" className="warning-text">
                  Log out when leaving your post
                </IonText>
              </div>
              <div className="warning-row">
                <img
                  src="/check.png"
                  alt="Greenwich Garden Estates Logo"
                  className="logo-image"
                />
                <IonText color="medium" className="warning-text">
                  Report suspicious activities to management
                </IonText>
              </div>
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
          cssClass="toast-danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
