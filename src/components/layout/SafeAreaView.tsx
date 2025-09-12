import React from "react";

interface SafeAreaViewProps {
  children: React.ReactNode;
}

const SafeAreaView: React.FC<SafeAreaViewProps> = ({ children }) => {
  return (
    <div
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
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
