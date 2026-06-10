"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

type AuthFloatingFieldProps = {
  label: string;
  type?: string;
  name?: string;
  defaultValue?: string;
  autoComplete?: string;
  required?: boolean;
  passwordToggle?: boolean;
  
};

export function AuthFloatingField({
  label,
  type = "text",
  name,
  defaultValue = "",
  autoComplete,
  required,
  passwordToggle = false,
}: AuthFloatingFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [visible, setVisible] = useState(false);

  const inputType =
    passwordToggle && !visible ? "password" : passwordToggle ? "text" : type;

  const hasValue = value.length > 0;
  const labelIsHot = focused || hasValue;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={[
          "pointer-events-none absolute left-6 top-[-0.58rem] z-[1] bg-[#1a1a1a] px-2 text-[0.72rem] font-semibold transition",
          labelIsHot ? "text-fly-orange" : "text-[#a3a3a3]",
        ].join(" ")}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={inputType}
        className={[
          "h-[52px] w-full rounded-full border border-[#444444] bg-transparent px-6 text-[0.92rem] text-white outline-none transition",
          passwordToggle ? "pr-12" : "",
          focused ? "border-fly-orange shadow-[0_0_0_3px_rgba(249,115,22,0.12)]" : "",
        ].join(" ")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        required={required}
      />
      {passwordToggle ? (
        <button
          type="button"
          className="absolute right-4 top-1/2 grid -translate-y-1/2 place-items-center border-0 bg-transparent p-1 text-[#666666] transition hover:text-[#a3a3a3]"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </button>
      ) : null}
    </div>
  );
}
