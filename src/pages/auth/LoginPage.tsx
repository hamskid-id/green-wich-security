import React, { useState } from "react";
import { IonPage, IonContent, IonText, IonToast, IonIcon } from "@ionic/react";
import { call, lockClosed } from "ionicons/icons";
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
      history.push("/home");
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
            <p className="app-subtitle">Resident Access Portal</p>
          </div>

          {/* Auth Tabs */}
          <div className="auth-tabs">
            <div className="auth-tab active">Login</div>
            <div className="auth-tab" onClick={() => history.push("/register")}>
              Create Account
            </div>
          </div>

          {/* Login Form */}
          <div className="auth-form">
            <CustomInput
              icon={call}
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
