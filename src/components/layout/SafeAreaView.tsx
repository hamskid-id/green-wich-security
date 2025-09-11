import React from "react";

interface SafeAreaViewProps {
  children: React.ReactNode;
}

const SafeAreaView: React.FC<SafeAreaViewProps> = ({ children }) => {
  return (
    <div
      style={{
        paddingTop: "var(--ion-safe-area-top)",
        paddingBottom: "var(--ion-safe-area-bottom)",
        paddingLeft: "var(--ion-safe-area-left)",
        paddingRight: "var(--ion-safe-area-right)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};

export default SafeAreaView;
