import React from "react";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import {
  home,
  qrCodeOutline,
  notificationsOutline,
  person,
  timerOutline,
} from "ionicons/icons";
import HomePage from "../../pages/homePage/HomePage";
import CreateVisitorCodePage from "../../pages/createVisitorCodePage/CreateVisitorCodePage";
import ManageAccessCodesPage from "../../pages/manageAccessCodesPage/ManageAccessCodesPage";
import NotificationsPage from "../../pages/notificationsPage/NotificationsPage";
import HistoryLogsPage from "../../pages/historyLogsPage/HistoryLogsPage";
import CodeGeneratedSuccessPage from "../../pages/successCodePage/CodeGeneratedSuccessPage";
import ProfilePage from "../../pages/profilePage/ProfilePage";
import VerifyAccessCodePage from "../../pages/verifyAccessCode/VerifyAccessCode";
import VerificationResultPage from "../../pages/verificationResult/VerifyResult";

const MobileLayout: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        {/* Authenticated routes */}
        {/* <Route path="/home" component={HomePage} exact />
        <Route path="/visitor-access" component={HomePage} exact />
        <Route
          path="/success-code"
          component={CodeGeneratedSuccessPage}
          exact
        /> */}
        {/* <Route path="/notifications" component={NotificationsPage} exact /> */}
        <Route path="/history-logs" component={HistoryLogsPage} exact />
        {/* <Route
          path="/create-visitor-code"
          component={CreateVisitorCodePage}
          exact
        />
        <Route
          path="/manage-acess-codes"
          component={ManageAccessCodesPage}
          exact
        /> */}
        <Route
          path="/verify-acess-codes"
          component={VerifyAccessCodePage}
          exact
        />

        <Route
          path="/verification-result"
          component={VerificationResultPage}
          exact
        />
{/* 
        <Route path="/profile" component={ProfilePage} exact /> */}
        {/* Default redirect */}
        <Route
          exact
          path="/"
          render={() => <Redirect to="/verify-acess-codes" />}
        />
        {/* Catch-all */}
        <Route render={() => <Redirect to="/verify-acess-codes" />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="custom-tab-bar">
        {/* <IonTabButton tab="home" href="/home">
          <IonIcon aria-hidden="true" icon={home} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton> */}

        <IonTabButton tab="verify-acess-codes" href="/verify-acess-codes">
          <IonIcon icon={qrCodeOutline} />
          <IonLabel>Verify</IonLabel>
        </IonTabButton>

        <IonTabButton tab="history-logs" href="/history-logs">
          <IonIcon icon={timerOutline} />
          <IonLabel>History</IonLabel>
        </IonTabButton>

        {/* <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={person} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton> */}
      </IonTabBar>
    </IonTabs>
  );
};

export default MobileLayout;
