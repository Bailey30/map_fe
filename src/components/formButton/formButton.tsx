import { useEffect } from "react";
import { useFormStatus } from "react-dom";

interface Props {
  text: string;
}
export default function FormButton({ text }: Props) {
  const status = useFormStatus();

  return (
    <button type="submit" disabled={status.pending}>
      {text}
    </button>
  );
}
