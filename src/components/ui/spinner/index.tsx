import { IonApp, IonSpinner } from "@ionic/react";

export const Spinner: React.FC = () => (
  <IonApp>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "var(--ion-background-color)",
      }}
    >
      <IonSpinner name="crescent" color="primary" />
    </div>
  </IonApp>
);
