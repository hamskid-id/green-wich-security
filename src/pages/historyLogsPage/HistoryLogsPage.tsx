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
  IonItem,
  IonLabel,
  IonChip,
  IonSearchbar,
  IonList,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { chevronDown, funnel, person } from "ionicons/icons";
import "./HistoryLogsPage.css";

interface VisitorLog {
  id: string;
  visitorName: string;
  date: string;
  time: string;
  status: "Checked-In" | "Checked-Out" | "Departed";
}

const HistoryLogsPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [visitorLogs] = useState<VisitorLog[]>([
    {
      id: "1",
      visitorName: "John Smith",
      date: "May 28, 2024",
      time: "10:25 AM",
      status: "Checked-In",
    },
    {
      id: "2",
      visitorName: "Sarah Johnson",
      date: "May 27, 2024",
      time: "2:30 PM",
      status: "Departed",
    },
    {
      id: "3",
      visitorName: "Mike Chen",
      date: "May 27, 2024",
      time: "11:15 AM",
      status: "Departed",
    },
    {
      id: "4",
      visitorName: "Michael Brown",
      date: "May 26, 2024",
      time: "4:23 PM",
      status: "Departed",
    },
    {
      id: "5",
      visitorName: "Emily Wilson",
      date: "May 25, 2024",
      time: "7:00 PM",
      status: "Checked-In",
    },
    {
      id: "6",
      visitorName: "David Lee",
      date: "May 24, 2024",
      time: "9:45 AM",
      status: "Departed",
    },
  ]);

  const handleRefresh = (event: CustomEvent) => {
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  const filteredLogs = visitorLogs.filter((log) =>
    log.visitorName.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Checked-In":
        return "success";
      case "Departed":
        return "medium";
      case "Checked-Out":
        return " primary";
      default:
        return "medium";
    }
  };

  return (
    <IonPage>
      <IonHeader className="app-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>
            <div className="history-header-title">
              <div className="header-content">
                <h1 className="header-title">History Logs</h1>
                <p className="header-subtitle">
                  View all visitor access attempts
                </p>
              </div>
              <IonIcon icon={funnel} className="funnel-icon" />
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="search-container">
         <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search visitor logs..."
            showClearButton="focus"
            className="custom-searchbar"
          />
        </div>

        <IonList className="visitor-logs-list">
          {filteredLogs.map((log) => (
            <IonItem key={log.id} className="visitor-log-item" button>
              <div className="visitor-info">
                <div className="visitor-header">
                  <IonLabel className="visitor-name">
                    {log.visitorName}
                  </IonLabel>
                  <IonChip
                    color={getStatusColor(log.status)}
                    className="status-chip"
                  >
                    {log.status}
                  </IonChip>
                </div>
                <div className="visitor-datetime">
                  <span className="visit-date">{log.date}</span>
                  <span className="visit-time">• {log.time}</span>
                </div>
              </div>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HistoryLogsPage;
