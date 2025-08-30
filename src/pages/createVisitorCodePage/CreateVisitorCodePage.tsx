import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonToast,
  IonProgressBar,
} from "@ionic/react";
import { person, calendar, time, documentText } from "ionicons/icons";
import CustomInput from "../../components/ui/customInput/CustomInput";
import CustomButton from "../../components/ui/customButton/CustomButton";
import "./CreateVisitorCodePage.css";
import { useHistory } from "react-router";
import { ApiResponse, useApi } from "../../hooks/useApi";
import { CodeData } from "../../types";

interface CreateCodeRequest {
  visitor_name: string;
  visit_purpose?: string;
  start_time?: string;
  end_time?: string;
  notes?: string;
}

const CreateVisitorCodePage: React.FC = () => {
  const [visitorName, setVisitorName] = useState<string>("");
  const [visitPurpose, setVisitPurpose] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const history = useHistory();
  const { usePost } = useApi();

  // Create the mutation for generating access code
  const createCodeMutation = usePost<ApiResponse<CodeData>, CreateCodeRequest>(
    "/access-codes"
  );

  const handleGenerateCode = async (): Promise<void> => {
    if (!visitorName || !startTime || !endTime) {
      setToastMessage("Please fill in all required fields");
      setShowToast(true);
      return;
    }

    try {
      const requestData: CreateCodeRequest = {
        visitor_name: visitorName,
        visit_purpose: visitPurpose,
        start_time: startTime,
        end_time: endTime,
        notes: notes,
      };

      const response = await createCodeMutation.mutateAsync(requestData);
      console.log(response);
      // Navigate to success page with the generated code data
      history.push("/success-code", {
        codeData: { ...response?.data, startTime, endTime, notes },
      });
    } catch (error: any) {
      setToastMessage(
        error?.message || "Failed to generate code. Please try again."
      );
      setShowToast(true);
    }
  };

  const isFormValid = visitorName.trim() && startTime && endTime;

  return (
    <IonPage>
      <IonHeader className="app-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle className="create-header-title">
            Create Visitor Code
          </IonTitle>
        </IonToolbar>
        {createCodeMutation.isPending && (
          <IonProgressBar type="indeterminate" color="primary" />
        )}
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="page-description">
          <p>
            Generate a secure access code for your visitor with custom time
            restrictions.
          </p>
        </div>

        <CustomInput
          icon={person}
          label="Visitor Name"
          value={visitorName}
          onIonInput={(e) => setVisitorName(e.detail.value!)}
          placeholder="Enter visitor's full name"
          required
        />

        <CustomInput
          label="Visit Purpose"
          value={visitPurpose}
          onIonInput={(e) => setVisitPurpose(e.detail.value!)}
          placeholder="Select purpose"
        />

        <CustomInput
          icon={calendar}
          label="Start Time"
          type="datetime-local"
          value={startTime}
          onIonInput={(e) => setStartTime(e.detail.value!)}
          placeholder="mm/dd/yyyy --:-- --"
          required
        />

        <CustomInput
          icon={calendar}
          label="End Time"
          type="datetime-local"
          value={endTime}
          onIonInput={(e) => setEndTime(e.detail.value!)}
          placeholder="mm/dd/yyyy --:-- --"
          required
        />

        <CustomInput
          icon={documentText}
          label="Optional Notes"
          value={notes}
          onIonInput={(e) => setNotes(e.detail.value!)}
          placeholder="Add any special instructions or details"
          multiline={true}
        />

        <CustomButton
          onClick={handleGenerateCode}
          disabled={!isFormValid || createCodeMutation.isPending}
          loading={createCodeMutation.isPending}
        >
          {createCodeMutation.isPending ? "Generating..." : "Generate Code"}
        </CustomButton>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          cssClass={
            toastMessage.includes("Failed") ? "toast-error" : "toast-success"
          }
        />
      </IonContent>
    </IonPage>
  );
};

export default CreateVisitorCodePage;
