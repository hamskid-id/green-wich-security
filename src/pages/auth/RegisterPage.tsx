import React, { useState } from "react";
import { IonPage, IonContent, IonText, IonToast, IonIcon } from "@ionic/react";
import { call, lockClosed, person, home } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import "./AuthPages.css";
import CustomInput from "../../components/ui/customInput/CustomInput";
import CustomButton from "../../components/ui/customButton/CustomButton";

const RegisterPage: React.FC = () => {
  const [first_name, setfirst_name] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [last_name, setlast_name] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [unit_id, setunit_id] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password_confirmation, setpassword_confirmation] =
    useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const { register, isLoading } = useAuthStore();
  const history = useHistory();

  const handleRegister = async (): Promise<void> => {
    if (password !== password_confirmation) {
      setToastMessage("Passwords do not match");
      setShowToast(true);
      return;
    }

    try {
      const response = await register({
        email,
        first_name,
        last_name,
        phone,
        unit_id,
        password,
        password_confirmation,
      });
      // Registration successful - maybe redirect to verification page or login
      history.push("/verify-email", { email });
    } catch (error: any) {
      setToastMessage(error.message || "Registration failed");
      setShowToast(true);
    }
  };

  const isFormValid =
    first_name && phone && unit_id && password && password_confirmation;

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
            <div className="auth-tab" onClick={() => history.push("/login")}>
              Login
            </div>
            <div className="auth-tab active">Create Account</div>
          </div>

          {/* Registration Form */}
          <div className="auth-form">
            <CustomInput
              icon={person}
              label="Email"
              type="email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
              placeholder="Enter your email address"
            />
            <CustomInput
              icon={person}
              label="First Name"
              type="text"
              value={first_name}
              onIonInput={(e) => setfirst_name(e.detail.value!)}
              placeholder="Enter your full name"
            />
            <CustomInput
              icon={person}
              label="Last Name"
              type="text"
              value={last_name}
              onIonInput={(e) => setlast_name(e.detail.value!)}
              placeholder="Enter your last name"
            />
            <CustomInput
              icon={call}
              label="Phone Number"
              type="tel"
              value={phone}
              onIonInput={(e) => setPhone(e.detail.value!)}
              placeholder="+234 800 123 4567"
            />

            <CustomInput
              icon={home}
              label="Unit Id"
              type="text"
              value={unit_id}
              onIonInput={(e) => setunit_id(e.detail.value!)}
              placeholder="e.g., A-101, B-205"
            />

            <CustomInput
              icon={lockClosed}
              label="Password"
              type="password"
              value={password}
              onIonInput={(e) => setPassword(e.detail.value!)}
              placeholder="Create a password"
            />

            <CustomInput
              icon={lockClosed}
              label="Confirm Password"
              type="password"
              value={password_confirmation}
              onIonInput={(e) => setpassword_confirmation(e.detail.value!)}
              placeholder="Confirm your password"
            />

            <CustomButton
              loading={isLoading}
              disabled={!isFormValid}
              onClick={handleRegister}
            >
              Create Account
            </CustomButton>

            <div className="support-link">
              <IonText color="medium">
                Already have an account?{" "}
                <IonText
                  color="primary"
                  onClick={() => history.push("/login")}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  Sign In
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
          cssClass="toast-danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
