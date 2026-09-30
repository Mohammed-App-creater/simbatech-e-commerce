"use client";

import { localDigits, toLocal } from "@/lib/phone";
import "./phone-input.css";

/*
 * A phone field with a fixed "+251" chip in front (same look as the create-account field in the
 * design). The customer types only the 9 digits that start with 7 or 9; a leading 0 or a pasted
 * +251 is trimmed. `value` may be in any form ("0911234567", "+251911234567", ""); `onChange`
 * receives an event-like object whose `target.value` is the local form "0911234567" (or "").
 *
 * Sizing props mirror the plain inputs it replaces so each screen keeps its own look.
 */
export default function PhoneInput({
  id,
  name,
  value,
  onChange,
  onKeyDown,
  placeholder = "9XX XXX XXX",
  height = 52,
  radius = 12,
  border = "1.5px solid #E6E4DE",
  fontSize = 15,
  background = "#FFFFFF",
  invalid = false,
  disabled = false,
  autoFocus = false,
  ...aria
}) {
  return (
    <div
      className="phone-input"
      data-invalid={invalid ? "" : undefined}
      style={{
        height: height + "px",
        boxSizing: "border-box",
        padding: "0 6px",
        border,
        borderRadius: radius + "px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          height: Math.min(height - 12, 36) + "px",
          padding: "0 10px",
          display: "flex",
          alignItems: "center",
          borderRadius: Math.max(radius - 3, 8) + "px",
          background: "#F3F2EE",
          fontSize: fontSize - 2 + "px",
          fontWeight: "700",
          color: "#3A3F4A",
        }}
      >
        +251
      </span>
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder={placeholder}
        value={localDigits(value)}
        disabled={disabled}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          const v = toLocal(e.target.value);
          if (onChange) onChange({ target: { value: v, name }, currentTarget: { value: v, name } });
        }}
        style={{
          flexGrow: "1",
          minWidth: "0",
          height: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          font: "inherit",
          fontSize: fontSize + "px",
          color: "#111318",
        }}
        suppressHydrationWarning
        {...aria}
      />
    </div>
  );
}
