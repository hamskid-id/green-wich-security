// src/pages/NotificationsPage.tsx
import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonList,
  IonBadge,
} from "@ionic/react";
import { arrowBack, timeOutline } from "ionicons/icons";
import "./NotificationsPage.css";

const NotificationsPage: React.FC = () => {
  const notifications = [
    {
      id: 1,
      visitor: "John Doe",
      time: "4:10 PM",
      timestamp: "10 minutes ago",
      date: "today",
      read: false,
    },
    {
      id: 2,
      visitor: "Sarah Johnson",
      time: "2:45 PM",
      timestamp: "2 hours ago",
      date: "today",
      read: false,
    },
    {
      id: 3,
      visitor: "Mike Brown",
      time: "1:30 PM",
      timestamp: "3 hours ago",
      date: "today",
      read: false,
    },
    {
      id: 4,
      visitor: "Alex Wilson",
      time: "11:15 AM",
      timestamp: "5 hours ago",
      date: "today",
      read: true,
    },
    {
      id: 5,
      visitor: "Emma Smith",
      time: "5:30 PM",
      timestamp: "1 day ago",
      date: "yesterday",
      read: true,
    },
    {
      id: 6,
      visitor: "David Lee",
      time: "2:15 PM",
      timestamp: "1 day ago",
      date: "yesterday",
      read: true,
    },
    {
      id: 7,
      visitor: "James Wilson",
      time: "3:40 PM",
      timestamp: "Monday, Jun 1",
      date: "last_week",
      read: true,
    },
    {
      id: 8,
      visitor: "Olivia Garcia",
      time: "1:20 PM",
      timestamp: "Monday, Jun 1",
      date: "last_week",
      read: true,
    },
  ];

  const groupedNotifications = {
    today: notifications.filter((n) => n.date === "today"),
    yesterday: notifications.filter((n) => n.date === "yesterday"),
    last_week: notifications.filter((n) => n.date === "last_week"),
  };

  const markAllAsRead = () => {
    console.log("Mark all as read");
  };

  return (
    <IonPage>
      <IonHeader className="notifications-page-header">
        <IonToolbar>
          <IonButton slot="start" fill="clear" routerLink="/home">
            <IonIcon icon={arrowBack} />
          </IonButton>
          <div className="notification-header-side-content">
            <div className="notification-page-container">
              <IonTitle className="notification-header-title">
                Notifications
              </IonTitle>
              <div className="notification-page-badge">3</div>
            </div>
            <button className="mark-read-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="notifications-page-content">
        {/* Today Section */}
        {groupedNotifications.today.length > 0 && (
          <div className="notification-page-section">
            <div className="section-header">
              <h2 className="section-title">Today</h2>
            </div>
            <IonList className="notification-page-list">
              {groupedNotifications.today.map((notification) => (
                <IonItem
                  key={notification.id}
                  className={`notification-page-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  lines="none"
                >
                  <div className="notification-page-content">
                    <div className="notification-page-header">
                      <div className="notification-page-indicator">
                        
                        <div className="status-container">
                          <IonBadge color="success" className="status-badge">
                          
                          </IonBadge>
                        </div>
                      </div>
                      <div className="notification-page-text">
                        <span className="visitor-name">
                          Visitor {notification.visitor}
                        </span>
                        <span className="action-text"> checked in at </span>
                        <span className="check-time">{notification.time}</span>
                      </div>
                    </div>
                    <div className="notification-page-timestamp">
                      <IonIcon icon={timeOutline} className="time-icon" />
                      <span>{notification.timestamp}</span>
                    </div>
                  </div>
                </IonItem>
              ))}
            </IonList>
          </div>
        )}

        {/* Yesterday Section */}
        {groupedNotifications.yesterday.length > 0 && (
          <div className="notification-page-section">
            <div className="section-header">
              <h2 className="section-title">Yesterday</h2>
            </div>
            <IonList className="notification-page-list">
              {groupedNotifications.yesterday.map((notification) => (
                <IonItem
                  key={notification.id}
                  className={`notification-page-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  lines="none"
                >
                  <div className="notification-page-content">
                    <div className="notification-page-header">
                      
                      <div className="notification-page-text">
                        <span className="visitor-name">
                          Visitor {notification.visitor}
                        </span>
                        <span className="action-text"> checked in at </span>
                        <span className="check-time">{notification.time}</span>
                      </div>
                    </div>
                    <div className="notification-page-timestamp">
                      <IonIcon icon={timeOutline} className="time-icon" />
                      <span>{notification.timestamp}</span>
                    </div>
                  </div>
                </IonItem>
              ))}
            </IonList>
          </div>
        )}

        {/* Last Week Section */}
        {groupedNotifications.last_week.length > 0 && (
          <div className="notification-page-section">
            <div className="section-header">
              <h2 className="section-title">Last Week</h2>
            </div>
            <IonList className="notification-page-list">
              {groupedNotifications.last_week.map((notification) => (
                <IonItem
                  key={notification.id}
                  className={`notification-page-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  lines="none"
                >
                  <div className="notification-page-content">
                    <div className="notification-page-header">
                      
                      <div className="notification-page-text">
                        <span className="visitor-name">
                          Visitor {notification.visitor}
                        </span>
                        <span className="action-text"> checked in at </span>
                        <span className="check-time">{notification.time}</span>
                      </div>
                    </div>
                    <div className="notification-page-timestamp">
                      <IonIcon icon={timeOutline} className="time-icon" />
                      <span>{notification.timestamp}</span>
                    </div>
                  </div>
                </IonItem>
              ))}
            </IonList>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NotificationsPage;
