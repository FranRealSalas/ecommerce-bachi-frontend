import { useOutsideAlerter } from "@/utils/outsideAlerter";
import { Dispatch, ReactNode, SetStateAction, useRef } from "react";

function Modal({ children, open, setOpen }: { children: ReactNode, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const modalRef = useRef(null);
    useOutsideAlerter(modalRef, setOpen);

    return (
        <>
            <div className={`flex flex-col inset-0 z-50 items-center w-full ${open ? "block" : " hidden"}`}>
                <div className="border border-gray-400 flex flex-col w-full rounded-xl shadow-lg bg-white p-4 items-start" ref={modalRef}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Modal;