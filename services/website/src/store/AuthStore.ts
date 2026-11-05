import { create } from "zustand";
import { persist } from "zustand/middleware";
import { usePartyStore } from "./PartyStore";
import { handleCreatedAt } from "../api/authentication/get_created-at/handleCreatedAt";

interface AuthValues {
	authVerboseMode: boolean;
	authValidation: boolean;
	isAuthenticated: boolean;
	clientUuid: string | null;
	cachedCreatedAts: Record<string, Date>;
}

interface AuthState extends AuthValues {
	setCachedCreatedAts: () => Promise<void>;
	removePlayerCreatedAt: (uuid: string | null) => void;
	resetValues: () => void;
};

export const useAuthStore = create<AuthState>() (
	persist(
		(set) => ({
			authVerboseMode: false,
			authValidation: true,
			isAuthenticated: false,
			clientUuid: null,
			cachedCreatedAts: {},

			setCachedCreatedAts: async () => {
				const members = usePartyStore.getState().members;
				const allUuids = Array.from(new Set(members))
					.filter((uuid): uuid is string => uuid !== null);

				const results = await Promise.all(
					allUuids.map(async (memberUuid) => {
						const userCreatedAt = await handleCreatedAt(memberUuid);
						if (!userCreatedAt)
							return null;
						return [memberUuid, userCreatedAt];
					})
				)

				set(() => ({
					cachedCreatedAts: Object.fromEntries(
						results.filter((item) => item !== null)
					),
				}));
			},

			removePlayerCreatedAt: (uuid) => {
				if (!uuid)
					return;

				set((state) => {
					const cachedCreatedAts = { ...state.cachedCreatedAts }
					delete cachedCreatedAts[uuid];
					return { cachedCreatedAts };
				})
			},

			resetValues: () => {
				set({
					isAuthenticated: false,
					clientUuid: null,
					cachedCreatedAts: {},
				});
			},
		}),
		{
			name: 'auth-storage',
		}
	)
);