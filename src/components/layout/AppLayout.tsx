import React from "react";
import { IonRouterOutlet } from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import VerifyAccessCodePage from "../../pages/verifyAccessCode/VerifyAccessCode";
import VerificationResultPage from "../../pages/verificationResult/VerifyResult";
import AccessCodePage from "../../pages/successCodePage/AccessCodePage";

const MobileLayout: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route
        path="/verify-access-codes"
        component={VerifyAccessCodePage}
        exact
      />

      <Route
        path="/verification-result"
        component={VerificationResultPage}
        exact
      />

      <Route path="/access-code/:code" component={AccessCodePage} exact />

      {/* Default redirect */}
      <Route
        exact
        path="/"
        render={() => <Redirect to="/verify-access-codes" />}
      />
      {/* Catch-all */}
      <Route render={() => <Redirect to="/verify-access-codes" />} />
    </IonRouterOutlet>
  );
};

export default MobileLayout;
