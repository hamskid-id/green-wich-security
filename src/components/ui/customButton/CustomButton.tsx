import React from "react";
import { IonButton, IonSpinner } from "@ionic/react";
import "./CustomButton.css";

interface CustomButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary";
  size?: "small" | "default" | "large";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => void;
  className?: string;
  [key: string]: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  loading = false,
  variant = "primary",
  size = "large",
  disabled = false,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <IonButton
      expand="full"
      fill="solid"
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${className} custom-button custom-button-${variant}`}
      {...props}
    >
      <div className="button-content">
        {loading ? <IonSpinner name="crescent" /> : <span>{children}</span>}
      </div>
    </IonButton>
  );
};

export default CustomButton;
