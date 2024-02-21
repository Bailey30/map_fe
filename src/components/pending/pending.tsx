import { useFormStatus } from "react-dom";

export default function Pending() {
    const status = useFormStatus()
    return <p>{status.pending && "hold on..."}</p>
}
