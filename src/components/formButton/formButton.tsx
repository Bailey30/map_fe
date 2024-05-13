import { useEffect } from "react";
import { useFormStatus } from "react-dom";

interface Props {
  text: string;
  disabled?: boolean;
  onClick?: any;
}
export default function FormButton({ text, disabled, onClick }: Props) {
  const status = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled ? disabled : status.pending}
      onClick={onClick && onClick}
    >
      {text}
    </button>
  );
}
