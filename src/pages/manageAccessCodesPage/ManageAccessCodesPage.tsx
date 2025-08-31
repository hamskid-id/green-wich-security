import React, { useState, useEffect, useMemo } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonToast,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonProgressBar,
} from "@ionic/react";
import { arrowBack, trash, close } from "ionicons/icons";
import "./ManageAccessCodesPage.css";
import AlertModal from "../../components/ui/alertModal/AlertModal";
import ShareModal from "../../components/ui/shareAccessCodeModal.tsx/ShareAccessCodeModal";
import { useApi } from "../../hooks/useApi";
import { AccessCode } from "../../types";
import { useHistory } from "react-router";
import FilterBar from "../../components/manageAccessCode/FilterBar";
import EmptyState from "../../components/manageAccessCode/EmptyState";
import CodeCard from "../../components/manageAccessCode/CodeCard";

const ManageAccessCodesPage: React.FC = () => {
  const history = useHistory();
  const { useInfinitePaginated, useDynamicDelete } = useApi();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCode, setSelectedCode] = useState<AccessCode | null>(null);
  const [shareCode, setShareCode] = useState<AccessCode | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

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

  const { mutate: deleteCode, isPending: isDeleting } =
    useDynamicDelete<void>();
  const rawCodes = data?.pages.flatMap((page) => page.data.data) ?? [];

  const processedCodes = useMemo(() => {
    return rawCodes.map((code) => {
      const createdTimestamp = new Date(code.created_at).getTime();
      const FIXED_DURATION_MINUTES = 30;
      const expirationTimestamp =
        createdTimestamp + FIXED_DURATION_MINUTES * 60 * 1000;
      const timeLeft = Math.max(0, expirationTimestamp - currentTime);

      let updatedStatus = code.status;
      if (code.status === "active" && timeLeft <= 0) {
        updatedStatus = "expired";
      }

      return {
        ...code,
        status: updatedStatus,
        remaining: {
          value: Math.floor(timeLeft / (1000 * 60)) || 0,
          unit: timeLeft <= 0 ? "min" : "mins",
        },
        expirationTimestamp,
      };
    });
  }, [rawCodes, currentTime]);

  const filteredCodes = useMemo(() => {
    if (activeFilter === "all") return processedCodes;
    return processedCodes.filter((code) => code.status === activeFilter);
  }, [processedCodes, activeFilter]);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeFilter === "all") {
      const timeoutId = setTimeout(() => refetch(), 100);
      return () => clearTimeout(timeoutId);
    }
  }, [activeFilter, refetch]);

  const handleShare = (code: AccessCode) => {
    setShareCode(code);
    setIsShareModalOpen(true);
  };

  const handleDelete = (code: AccessCode) => {
    setSelectedCode(code);
    setIsAlertModalOpen(true);
  };

  const handleRevokeConfirm = () => {
    if (selectedCode) {
      deleteCode(`/access-codes/${selectedCode.id}`, {
        onSuccess: () => {
          setToastMessage(`Code revoked for ${selectedCode.visitor_name}`);
          setShowToast(true);
          refetch();
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

  return (
    <IonPage>
      <IonHeader className="app-header">
        <IonToolbar>
          <IonButton
            slot="start"
            fill="clear"
            routerLink="/home"
            aria-label="Go back to Home"
          >
            <IonIcon icon={arrowBack} />
          </IonButton>
          <div className="header-side-content">
            <IonTitle className="header-title">Manage Access Codes</IonTitle>
            <button
              className="access-action-icon"
              aria-label="Create visitor code"
              onClick={() => history.push("/create-visitor-code")}
            >
              <img src="/button.svg" alt="Create code" className="logo-image" />
            </button>
          </div>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" color="primary" />}
      </IonHeader>

      <IonContent className="ion-padding">
        <FilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {isError && (
          <p className="ion-text-center text-red-500" role="alert">
            {error?.message || "Failed to fetch access codes"}
          </p>
        )}

        <div className="codes-list">
          {filteredCodes.map((code) => (
            <CodeCard
              key={code.id}
              code={code}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredCodes.length === 0 && !isLoading && (
          <EmptyState filter={activeFilter} />
        )}

        <IonInfiniteScroll
          onIonInfinite={async (ev) => {
            if (hasNextPage) await fetchNextPage();
            (ev.target as HTMLIonInfiniteScrollElement).complete();
          }}
          disabled={!hasNextPage}
        >
          <IonInfiniteScrollContent loadingText="Loading more access codes..." />
        </IonInfiniteScroll>

        {isFetchingNextPage && (
          <div className="ion-text-center" aria-live="polite">
            <IonSpinner name="crescent" />
          </div>
        )}

        <AlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          onConfirm={handleRevokeConfirm}
          title="Revoke Code"
          message="Are you sure you want to revoke this code? This action cannot be undone."
          confirmText="Yes, Revoke Code"
          cancelText="Cancel"
          type="danger"
          confirmIcon={trash}
          cancelIcon={close}
        />

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          accessCode={shareCode}
          onToast={setToastMessage}
        />

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
