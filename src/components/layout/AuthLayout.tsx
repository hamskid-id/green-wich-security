import React from "react";
import { IonRouterOutlet } from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import LoginPage from "../../pages/auth/LoginPage";
import ForgotPasswordPage from "../../pages/auth/ForegetPassword";
import VerifyEmailPage from "../../pages/auth/VerifyEmailPage";
import RegisterPage from "../../pages/auth/RegisterPage";

const AuthLayout = () => {
  return (
    <IonRouterOutlet>
      <Route path="/login" component={LoginPage} exact />
      <Route path="/register" component={RegisterPage} exact />
      <Route path="/forgot-password" component={ForgotPasswordPage} exact />
      <Route path="/verify-email" component={VerifyEmailPage} exact />

      {/* Default to login */}
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>

      {/* Catch-all: any other path redirects to login */}
      <Route render={() => <Redirect to="/login" />} />
    </IonRouterOutlet>
  );
};

export default AuthLayout;
