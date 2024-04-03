import { useFormStatus } from "react-dom";

export default function Pending() {
  const status = useFormStatus();
  return status.pending && <p role="status">hold on...</p>;
}
