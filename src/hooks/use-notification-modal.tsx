import { NotificationColumn } from "@/types";
import { create } from "zustand";
interface NotificationModal {
    isOpen: boolean;
    data?: NotificationColumn;
    onOpen: (data: NotificationColumn) => void;
    onClose: () => void;
}

const useNotificationModal = create<NotificationModal>((set) => ({
    isOpen: false,
    data: undefined,
    onOpen: (data: NotificationColumn) => set({ data, isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useNotificationModal;