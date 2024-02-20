import { createPortal } from "react-dom";

export default function CameraPortal({ children }: { children: any }) {
    return createPortal(children, document.getElementById("main"))
}
