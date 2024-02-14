"use client"
import { SET_IS_ADDING, TOGGLE_IS_ADDING } from "@/redux/controlsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function RouteChangeListener() {
    const pathname = usePathname()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (pathname === "/") {
            dispatch(SET_IS_ADDING(false))
        }
    }, [pathname])

    return <></>
}
