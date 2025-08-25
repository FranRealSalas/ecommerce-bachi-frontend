import { useOutsideAlerter } from "@/utils/outsideAlerter";
import { Dispatch, ReactNode, SetStateAction, useRef } from "react";

function Modal({ children, open, setOpen }: { children: ReactNode, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const modalRef = useRef(null);
    useOutsideAlerter(modalRef, setOpen);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="relative bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
            >
                {children}
            </div>
        </div>
    );
}

export default Modal;
