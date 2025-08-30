import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonToast,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonProgressBar,
} from "@ionic/react";
import {
  arrowBack,
  trashOutline,
  trash,
  close,
  arrowRedoSharp,
} from "ionicons/icons";
import "./ManageAccessCodesPage.css";
import AlertModal from "../../components/ui/alertModal/AlertModal";
import { useApi } from "../../hooks/useApi";
import { AccessCode } from "../../types";
import { formatDate, calculateRemainingTime } from "../../utils/helpers";
import { useHistory } from "react-router";

const ManageAccessCodesPage: React.FC = () => {
  const history = useHistory();
  const { useInfinitePaginated, useDelete } = useApi();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCode, setSelectedCode] = useState<AccessCode | null>(null);

  // Re-run query when filter changes
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
    refetch,
  } = useInfinitePaginated<AccessCode>(
    ["accessCodes", activeFilter],
    `/access-codes?status=${activeFilter === "all" ? "" : activeFilter}`,
    { limit: 25 }
  );

  const { mutate: deleteCode, isPending: isDeleting } = useDelete<void>(
    `/access-codes/${selectedCode?.id}`
  );

  const codes = data?.pages.flatMap((page) => page.data.data) ?? [];

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now()); // For triggering re-renders

  // Update current time every second to refresh countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filterOptions = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "expired", label: "Expired" },
    { id: "revoked", label: "Revoked" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "expired":
        return "medium";
      case "revoked":
        return "danger";
      default:
        return "primary";
    }
  };

  const handleShare = (code: AccessCode) => {
    setToastMessage(`Shared code for ${code.visitor_name}`);
    setShowToast(true);
  };

  const handleDelete = (code: AccessCode) => {
    setSelectedCode(code);
    setIsAlertModalOpen(true);
  };

  const handleRevokeConfirm = () => {
    if (selectedCode) {
      deleteCode(undefined, {
        onSuccess: () => {
          setToastMessage(`Code revoked for ${selectedCode.visitor_name}`);
          setShowToast(true);
        },
        onError: (error) => {
          setToastMessage(`Failed to revoke code: ${error.message}`);
          setShowToast(true);
        },
        onSettled: () => {
          setSelectedCode(null);
          setIsAlertModalOpen(false);
        },
      });
    }
  };

  const handleAlertClose = () => {
    setSelectedCode(null);
    setIsAlertModalOpen(false);
  };

  return (
    <IonPage>
      <IonHeader className="app-header">
        <IonToolbar>
          <IonButton slot="start" fill="clear" routerLink="/home">
            <IonIcon icon={arrowBack} />
          </IonButton>
          <div className="header-side-content">
            <IonTitle className="header-title">Manage Access Codes</IonTitle>
            <div
              className="access-action-icon"
              onClick={() => history.push("/create-visitor-code")}
            >
              <img src="/button.svg" alt="Logo" className="logo-image" />
            </div>
          </div>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" color="primary" />}
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Filters */}
        <div className="filter-swiper">
          <div className="filter-scroll-container">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                className={`filter-button ${
                  activeFilter === filter.id ? "filter-button-active" : ""
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {isError && (
          <p className="ion-text-center text-red-500">
            {error?.message || "Failed to fetch access codes"}
          </p>
        )}

        {/* List */}
        <div className="codes-list">
          {codes.map((code) => {
            const remaining =
              code.status === "active"
                ? calculateRemainingTime(code.created_at, code.expires_in)
                : { value: 0, unit: "min" };

            // Check if the code has expired (remaining time is 0 or less)
            const hasExpired = remaining.value <= 0;

            return (
              <IonCard key={code.id} className="code-card">
                <IonCardContent>
                  <div className="code-header">
                    <h3 className="code-name">{code.visitor_name}</h3>
                    <div className="code-actions">
                      <button
                        className={`action-button share ${
                          code.status !== "active" || hasExpired
                            ? "disabled"
                            : ""
                        }`}
                        onClick={() => handleShare(code)}
                        disabled={code.status !== "active" || hasExpired}
                      >
                        <IonIcon icon={arrowRedoSharp} />
                      </button>
                      <button
                        className={`action-button delete ${
                          code.status !== "active" || hasExpired
                            ? "disabled"
                            : ""
                        }`}
                        onClick={() => handleDelete(code)}
                        disabled={code.status !== "active" || hasExpired}
                      >
                        <IonIcon icon={trashOutline} />
                      </button>
                    </div>
                  </div>

                  <div className="status-row">
                    <IonBadge
                      color={getStatusColor(code.status)}
                      className="status-badge"
                    >
                      {code.status.charAt(0).toUpperCase() +
                        code.status.slice(1)}
                    </IonBadge>
                    <div className="expires-info">
                      {code.status === "active" && !hasExpired && (
                        <IonLabel>
                          Expires in {remaining.value} {remaining.unit}
                        </IonLabel>
                      )}
                    </div>
                  </div>

                  <div className="created-code-row">
                    <IonLabel>{formatDate(code.created_at)}</IonLabel>
                    <IonLabel>
                      <strong>Code: {code.code}</strong>
                    </IonLabel>
                  </div>
                </IonCardContent>
              </IonCard>
            );
          })}
        </div>

        {/* Infinite Scroll */}
        <IonInfiniteScroll
          onIonInfinite={async (ev) => {
            if (hasNextPage) {
              await fetchNextPage();
            }
            (ev.target as HTMLIonInfiniteScrollElement).complete();
          }}
          disabled={!hasNextPage}
        >
          <IonInfiniteScrollContent loadingText="Loading more access codes..." />
        </IonInfiniteScroll>

        {isFetchingNextPage && (
          <div className="ion-text-center">
            <IonSpinner name="crescent" />
          </div>
        )}

        {/* Alert Modal */}
        <AlertModal
          isOpen={isAlertModalOpen}
          onClose={handleAlertClose}
          onConfirm={handleRevokeConfirm}
          title="Revoke Code"
          message="Are you sure you want to revoke this code? This action cannot be undone."
          confirmText="Yes, Revoke Code"
          cancelText="Cancel"
          type="danger"
          confirmIcon={trash}
          cancelIcon={close}
        />

        {/* Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
          cssClass="toast-info"
        />
      </IonContent>
    </IonPage>
  );
};

export default ManageAccessCodesPage;
