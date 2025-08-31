import React from "react";
import { IonLabel } from "@ionic/react";

const EmptyState: React.FC<{ filter: string }> = ({ filter }) => (
  <div className="ion-text-center ion-margin-top">
    <IonLabel>
      <h3>No {filter === "all" ? "" : filter} access codes found</h3>
    </IonLabel>
  </div>
);

export default EmptyState;
