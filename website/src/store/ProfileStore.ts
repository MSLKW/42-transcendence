import { create } from "zustand";
import { persist } from "zustand/middleware";

export const BADGE_LABEL = [
	"Newcomer",
	"Beginner's Luck",
	"Challenger",
	"Enthusiast",
	"Risk Taker",
	"The Strategist",
	"Big 2 Champion",
] as const;
export type BADGE_TYPE = typeof BADGE_LABEL[number];

export const MEDAL_LABEL = [
	"First Login",
	"Login 1 Week",
	"Played 1 Game",
	"Played 10 Games",
	"Played 42 Games",
	"First Win",
	"Win Streak 2",
	"Win Streak 5",
	"Win Streak 10",
	"Master Collector",
] as const;
export type MEDAL_TYPE = typeof MEDAL_LABEL[number];

export const AVAILABILITY_LABEL = [
	"Offline",
	"Online",
	"Busy",
] as const;
export type AVAILABILITY_TYPE = typeof AVAILABILITY_LABEL[number];

export interface ProfileData {
	uuid: string | null;
	name: string | null;
	avatar: string | null;
	badge: BADGE_TYPE;
	level: number;
	xp: number;
	createdAt: Date;
	lastLogin: Date;
	totalPlayed: number;
	totalWins: number;
	totalLoss: number;
	winStreak: number;
	medals: Record<MEDAL_TYPE, Date | null>;
	availability: AVAILABILITY_TYPE;
};

const createDefaultProfile = (uuid: string, name: string, avatar: string, badge: BADGE_TYPE = "Newcomer"): ProfileData => ({
	uuid,
	name,
	avatar,
	badge,
	level: 1,
	xp: 0,
	createdAt: new Date(),
	lastLogin: new Date(),
	totalPlayed: 0,
    totalWins: 0,
    totalLoss: 0,
    winStreak: 0,
    medals: {
        "First Login": null,
        "Login 1 Week": null,
        "Played 1 Game": null,
        "Played 10 Games": null,
        "Played 42 Games": null,
        "First Win": null,
        "Win Streak 2": null,
        "Win Streak 5": null,
        "Win Streak 10": null,
        "Master Collector": null,
    },
    availability: "Online",
});

const defaultProfileInDb: ProfileData[] = [
	{
		uuid: "12345678-abcd-efgh-dev0-azrul0000000",
		name: "Dev-Azrul",
		avatar: "stock-1.webp",
		badge: "Risk Taker",
		level: 2,
		xp: 1111,
		createdAt: new Date("2026-08-01T01:01:01+08:00"),
		lastLogin: new Date("2026-08-01T01:01:01+08:00"),
		totalPlayed: 1,
		totalWins: 1,
		totalLoss: 1,
		winStreak: 1,
		medals: {
			"First Login": new Date("2026-08-01T01:01:01+08:00"),
			"Login 1 Week": new Date("2026-08-01T01:01:01+08:00"),
			"Played 1 Game": null,
			"Played 10 Games": null,
			"Played 42 Games": null,
			"First Win": null,
			"Win Streak 2": null,
			"Win Streak 5": null,
			"Win Streak 10": null,
			"Master Collector": null,
		},
		availability: "Offline",
	},
	{
		uuid: "12345678-abcd-efgh-dev0-max000000000",
		name: "Dev-Max",
		avatar: "stock-2.webp",
		badge: "The Strategist",
		level: 3,
		xp: 2222,
		createdAt: new Date("2026-08-01T02:02:02+08:00"),
		lastLogin: new Date("2026-08-01T02:02:02+08:00"),
		totalPlayed: 2,
		totalWins: 2,
		totalLoss: 2,
		winStreak: 2,
		medals: {
			"First Login": new Date("2026-08-01T02:02:02+08:00"),
			"Login 1 Week": new Date("2026-08-01T02:02:02+08:00"),
			"Played 1 Game": new Date("2026-08-01T02:02:02+08:00"),
			"Played 10 Games": null,
			"Played 42 Games": null,
			"First Win": null,
			"Win Streak 2": null,
			"Win Streak 5": null,
			"Win Streak 10": null,
			"Master Collector": null,
		},
		availability: "Offline",
	},
	{
		uuid: "12345678-abcd-efgh-dev0-jeremy000000",
		name: "Dev-Jeremy",
		avatar: "stock-3.webp",
		badge: "Big 2 Champion",
		level: 4,
		xp: 3333,
		createdAt: new Date("2026-08-01T03:03:03+08:00"),
		lastLogin: new Date("2026-08-01T03:03:03+08:00"),
		totalPlayed: 3,
		totalWins: 3,
		totalLoss: 3,
		winStreak: 3,
		medals: {
			"First Login": new Date("2026-08-01T03:03:03+08:00"),
			"Login 1 Week": new Date("2026-08-01T03:03:03+08:00"),
			"Played 1 Game": new Date("2026-08-01T03:03:03+08:00"),
			"Played 10 Games": new Date("2026-08-01T03:03:03+08:00"),
			"Played 42 Games": null,
			"First Win": null,
			"Win Streak 2": null,
			"Win Streak 5": null,
			"Win Streak 10": null,
			"Master Collector": null,
		},
		availability: "Offline",
	},
	{
		uuid: "12345678-abcd-efgh-dev0-aisyah000000",
		name: "Dev-Aisyah",
		avatar: "stock-4.webp",
		badge: "Newcomer",
		level: 5,
		xp: 4444,
		createdAt: new Date("2026-08-01T04:04:04+08:00"),
		lastLogin: new Date("2026-08-01T04:04:04+08:00"),
		totalPlayed: 4,
		totalWins: 4,
		totalLoss: 4,
		winStreak: 4,
		medals: {
			"First Login": new Date("2026-08-01T04:04:04+08:00"),
			"Login 1 Week": new Date("2026-08-01T04:04:04+08:00"),
			"Played 1 Game": new Date("2026-08-01T04:04:04+08:00"),
			"Played 10 Games": new Date("2026-08-01T04:04:04+08:00"),
			"Played 42 Games": new Date("2026-08-01T04:04:04+08:00"),
			"First Win": null,
			"Win Streak 2": null,
			"Win Streak 5": null,
			"Win Streak 10": null,
			"Master Collector": null,
		},
		availability: "Offline",
	},
	{
		uuid: "12345678-abcd-efgh-dev0-bunyod000000",
		name: "Dev-Bun Yod",
		avatar: "stock-5.webp",
		badge: "Newcomer",
		level: 6,
		xp: 5555,
		createdAt: new Date("2026-08-01T05:05:05+08:00"),
		lastLogin: new Date("2026-08-01T05:05:05+08:00"),
		totalPlayed: 5,
		totalWins: 5,
		totalLoss: 5,
		winStreak: 5,
		medals: {
			"First Login": new Date("2026-08-01T05:05:05+08:00"),
			"Login 1 Week": new Date("2026-08-01T05:05:05+08:00"),
			"Played 1 Game": new Date("2026-08-01T05:05:05+08:00"),
			"Played 10 Games": new Date("2026-08-01T05:05:05+08:00"),
			"Played 42 Games": new Date("2026-08-01T05:05:05+08:00"),
			"First Win": new Date("2026-08-01T05:05:05+08:00"),
			"Win Streak 2": null,
			"Win Streak 5": null,
			"Win Streak 10": null,
			"Master Collector": null,
		},
		availability: "Online",
	},
	{
		uuid: "12345678-abcd-efgh-dev0-prag00000000",
		name: "Dev-Prag",
		avatar: "stock-6.webp",
		badge: "Newcomer",
		level: 7,
		xp: 6666,
		createdAt: new Date("2026-08-01T06:06:06+08:00"),
		lastLogin: new Date("2026-08-01T06:06:06+08:00"),
		totalPlayed: 6,
		totalWins: 6,
		totalLoss: 6,
		winStreak: 6,
		medals: {
			"First Login": new Date("2026-08-01T06:06:06+08:00"),
			"Login 1 Week": new Date("2026-08-01T06:06:06+08:00"),
			"Played 1 Game": new Date("2026-08-01T06:06:06+08:00"),
			"Played 10 Games": new Date("2026-08-01T06:06:06+08:00"),
			"Played 42 Games": new Date("2026-08-01T06:06:06+08:00"),
			"First Win": new Date("2026-08-01T06:06:06+08:00"),
			"Win Streak 2": new Date("2026-08-01T06:06:06+08:00"),
			"Win Streak 5": null,
			"Win Streak 10": null,
			"Master Collector": null,
		},
		availability: "Busy",
	},
];

interface ProfileValues {
	clientUuid: string | null;
	isAuthenticated: boolean;
	validateResponse: Response | undefined;
	profilesInDb: ProfileData[];
};

interface ProfileState extends ProfileValues {
	setClientUuid: (uuid: string) => void;
	setIsAuthenticated: (isValid: boolean) => void;
	setValidateResponse: (validation: Response) => void;
	createClientProfile: (name: string, avatar: string) => void;
	updateClientProfile: (name: string, avatar: string, badge: BADGE_TYPE) => void;
	getProfileData: (uuid: string) => ProfileData | undefined;
	resetProfilesInDb: () => void;
};

export const useProfileStore = create<ProfileState>() (
	persist(
		(set, get) => ({
			clientUuid: null,
			isAuthenticated: false, 
			validateResponse: undefined,
			profilesInDb: defaultProfileInDb,

			setClientUuid: (uuid) => {
				set({
					clientUuid: uuid,
				});
			},
			setIsAuthenticated: (isValid) => {
				set({
					isAuthenticated: isValid,
				});
			},
			setValidateResponse: (validation) => {
				set({
					validateResponse: validation,
				});
			},
			createClientProfile: (name, avatar) => {
				const { clientUuid, profilesInDb } = get();
				if (!clientUuid)
					return;

				const profileExists = profilesInDb.some((p) => p.uuid === clientUuid);
				if (profileExists) {
					return {
						profilesInDb: profilesInDb.map((p) =>
							p.uuid === clientUuid
								? { ...p, name, avatar }
								: p
						)
					};
				}

				const newProfile = createDefaultProfile(clientUuid!, name, avatar);
				set({
					profilesInDb: [...profilesInDb, newProfile],
				});
			},
			updateClientProfile: (name, avatar, badge) => {
				const { clientUuid, profilesInDb } = get();
				if (!clientUuid)
					return;

				const profileExists = profilesInDb.some((p) => p.uuid === clientUuid);
				if (!profileExists) {
					const newProfile = createDefaultProfile(clientUuid!, name, avatar, badge);
					set({
						profilesInDb: [...profilesInDb, newProfile],
					});
					return;
				}

				set({
					profilesInDb: profilesInDb.map((p) => p.uuid === clientUuid
						? { ...p, name, avatar, badge }
						: p
					),
				});
			},
			getProfileData: (uuid) => {
				const profiles = get().profilesInDb;
				return profiles.find(p => p.uuid === uuid);
			},
			resetProfilesInDb: () => {
				set({
					profilesInDb: defaultProfileInDb,
				});
			},
		}),
		{
			name: 'profile-storage',
		}
	)
);