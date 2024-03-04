import { createPortal } from "react-dom";

export default function CameraPortal({ children }: { children: any }) {
    if(!children) return 
        const main = document.getElementById("main")
    return (
        <>
            {main &&children&& createPortal(children, main)}
        </>
    )
}
