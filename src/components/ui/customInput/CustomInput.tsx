import React from "react";
import {
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonTextarea,
} from "@ionic/react";
import type { InputCustomEvent, TextareaCustomEvent } from "@ionic/react";
import type {
  InputChangeEventDetail,
  TextareaChangeEventDetail,
} from "@ionic/core";
import "./CustomInput.css";

interface CustomInputProps {
  icon?: string;
  label?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week";
  value?: string;
  onIonInput?: (
    event:
      | InputCustomEvent<InputChangeEventDetail>
      | TextareaCustomEvent<TextareaChangeEventDetail>
  ) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  className?: string;
  [key: string]: any;
}

const CustomInput: React.FC<CustomInputProps> = ({
  icon,
  label,
  type = "text",
  value,
  onIonInput,
  placeholder,
  required = false,
  disabled = false,
  multiline = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`custom-input-container ${className}`}>
      {label && <div className="input-label">{label}</div>}
      <IonItem
        lines="none"
        className={`custom-input-item ${multiline ? "multiline" : ""}`}
      >
        {icon && <IonIcon icon={icon} slot="start" className="input-icon" />}
        {multiline ? (
          <IonTextarea
            value={value}
            onIonInput={onIonInput}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="custom-textarea"
            rows={4}
            {...props}
          />
        ) : (
          <IonInput
            type={type}
            value={value}
            onIonInput={onIonInput}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="custom-input"
            {...props}
          />
        )}
      </IonItem>
    </div>
  );
};

export default CustomInput;
