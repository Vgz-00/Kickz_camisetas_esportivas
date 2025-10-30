
import type { AdminType } from "../../utils/AdminType";
import { create } from "zustand";

type AdminStore = {
    admin: AdminType;
    logaAdmin: (adminLogado: AdminType) => void;
    deslogaAdmin: () => void;
};

const getInitialAdminState = (): AdminType => {
    try {
        const storedAdmin = localStorage.getItem('adminLogado');
        return storedAdmin ? JSON.parse(storedAdmin) : {} as AdminType;
    } catch (e) {
        console.error("Erro ao carregar admin do localStorage:", e);
        return {} as AdminType;
    }
};

export const useAdminStore = create<AdminStore>((set) => ({
    admin: getInitialAdminState(),
    
    logaAdmin: (adminLogado) => {
        localStorage.setItem('adminLogado', JSON.stringify(adminLogado));
        set({ admin: adminLogado });
    },
    
    deslogaAdmin: () => {
        localStorage.removeItem('adminLogado');
        set({ admin: {} as AdminType });
    }
}));