import { create } from "zustand";
import { InfoUser } from "../interfaces/user/info-user";

interface AuthStore {
    token: string;
    role: string;
    setToken(token: string): void;
    setRole(role: string): void;
    signOut(): void;
}

interface HomeStore {
    isLoading: boolean;
    setIsLoading(isLoading: boolean): void;
}

interface StateStore {
    isLoading: boolean;
    setIsLoading(isLoading: boolean): void;
}

interface UserDataStore {
    setUser(user: InfoUser): void;
    user: InfoUser | null;
}



const useAuthStore = create<AuthStore>((set) => ({
    token: "",
    role: "",
    user: null,
    setToken: (token: string) => set((_) => ({ token })),
    setRole: (role: string) => set((_) => ({ role })),
    signOut: () => {
        set({ token: "" });
    },
}));

const useHomeStore = create<HomeStore>((set) => ({
    isLoading: true,
    setIsLoading: (isLoading: boolean) => set((_) => ({ isLoading })),
}));

const useUserDataStore = create<UserDataStore>((set) => ({
    user: null,
    setUser: (user: InfoUser) => set((_) => ({ user }))
}));

const useStateStore = create<StateStore>((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set((_) => ({ isLoading })),
}));


export {
    useAuthStore,
    useHomeStore,
    useStateStore,
    useUserDataStore
};
