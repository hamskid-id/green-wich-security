import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "./stores/authStore";
import AuthLayout from "./components/layout/AuthLayout";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useEffect, useState } from "react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import MobileLayout from "./components/layout/AppLayout";
import { Spinner } from "./components/ui/spinner";

setupIonicReact();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Give the store time to rehydrate from persistence
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 100); // Small delay to let Zustand persist rehydrate

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while app is initializing
  if (!isAppReady) return <Spinner />;

  return (
    <IonApp>
      <QueryClientProvider client={queryClient}>
        <IonReactRouter>
          {isAuthenticated ? <MobileLayout /> : <AuthLayout />}
        </IonReactRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </IonApp>
  );
};

export default App;
