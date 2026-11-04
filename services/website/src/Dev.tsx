import { useRef } from "react";
import { useChatStore } from "./store/ChatStore";
import { useAuthStore } from "./store/AuthStore";
import { useDevStore } from "./store/DevStore";
import { useFriendsStore } from "./store/FriendsStore";
import { useGameStore } from "./store/GameStore";
import { useGameStatsStore } from "./store/GameStatsStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "./store/NotificationStore";
import { usePartyStore } from "./store/PartyStore";
import { useProfileStore } from "./store/ProfileStore";
import { useSceneStore } from "./store/SceneStore";
import { DevButton } from "./components/dev/DevBtn";
import { useFrameView } from "./utilities/react/useFrameView";

export default function Dev() {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const authVerboseMode = useAuthStore((store) => store.authVerboseMode);
	const authValidation = useAuthStore((store) => store.authValidation);
	const cachedCreatedAts = useAuthStore((store) => store.cachedCreatedAts);
	const chatVerboseMode = useChatStore((store) => store.chatVerboseMode);
	const chatSocketId = useChatStore((store) => store.chatSocketId);
	const chatRoomId = useChatStore((store) => store.chatRoomId);
	const friendsVerboseMode = useFriendsStore((store) => store.friendsVerboseMode);
	const cachedFriends = useFriendsStore((store) => store.cachedFriends);
	const gameVerboseMode = useGameStore((store) => store.gameVerboseMode);
	const gameSocketId = useGameStore((store) => store.gameSocketId);
	const cachedStats = useGameStatsStore((store) => store.cachedStats);
	const cachedBadges = useGameStatsStore((store) => store.cachedBadges);
	const gameStatsVerboseMode = useGameStatsStore((store) => store.gameStatsVerboseMode);
	const notifications = useNotificationStore((store) => store.notifications);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const partyVerboseMode = usePartyStore((store) => store.partyVerboseMode);
	const partySocketId = usePartyStore((store) => store.partySocketId);
	const partyGameId = usePartyStore((store) => store.partyGameId);
	const profileValidation = useProfileStore((store) => store.profileValidation);
	const profileVerboseMode = useProfileStore((store) => store.profileVerboseMode);
	const cachedProfiles = useProfileStore((store) => store.cachedProfiles);
	const sceneVerboseMode = useSceneStore((store) => store.sceneVerboseMode);

	const toggleAll = useRef(false);

	useFrameView();

	return (
		<section className="w-full text-b4 py-1rem gap-1rem flex flex-col px-3rem bg-n0 gap-10">
			{/* utilities */}
				<div>
					<h2><b>Utilities:</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label="Frame" call={() => useDevStore.setState((store) => ({ showFrame: !store.showFrame }))} />
						<DevButton label="Notify Message" call={() => useNotificationStore.getState().showNotification("This is a message notification", NOTIFICATION_TYPE.message)} />
						<DevButton label="Notify Error" call={() => useNotificationStore.getState().showNotification("This is an error notification", NOTIFICATION_TYPE.error)} />
						<DevButton label={`notifications:${notifications.length}`} call={() => console.log("notifications:", notifications)} />
					</ul>
				</div>
			{/* verbose mode */}
				<div>
					<h2><b>Verbose Modes:</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`toggle all`} call={() => {
							toggleAll.current = !toggleAll.current;
							useSceneStore.setState({ sceneVerboseMode: toggleAll.current });
							useAuthStore.setState({ authVerboseMode: toggleAll.current })
							useProfileStore.setState({ profileVerboseMode: toggleAll.current })
							useGameStatsStore.setState({ gameStatsVerboseMode: toggleAll.current })
							usePartyStore.setState({ partyVerboseMode: toggleAll.current })
							useGameStore.setState({ gameVerboseMode: toggleAll.current })
							useChatStore.setState({ chatVerboseMode: toggleAll.current })
							useFriendsStore.setState({ friendsVerboseMode: toggleAll.current })
						}}/>
						<DevButton label={`scene: ${sceneVerboseMode}`} call={() => useSceneStore.setState({ sceneVerboseMode: !sceneVerboseMode })}/>
						<DevButton label={`auth: ${authVerboseMode}`} call={() => useAuthStore.setState({ authVerboseMode: !authVerboseMode })}/>
						<DevButton label={`profile: ${profileVerboseMode}`} call={() => useProfileStore.setState({ profileVerboseMode: !profileVerboseMode })}/>
						<DevButton label={`game-stats: ${gameStatsVerboseMode}`} call={() => useGameStatsStore.setState({ gameStatsVerboseMode: !gameStatsVerboseMode })}/>
						<DevButton label={`party: ${partyVerboseMode}`} call={() => usePartyStore.setState({ partyVerboseMode: !partyVerboseMode })}/>
						<DevButton label={`game: ${gameVerboseMode}`} call={() => useGameStore.setState({ gameVerboseMode: !gameVerboseMode })}/>
						<DevButton label={`chat: ${chatVerboseMode}`} call={() => useChatStore.setState({ chatVerboseMode: !chatVerboseMode })}/>
						<DevButton label={`friends: ${friendsVerboseMode}`} call={() => useFriendsStore.setState({ friendsVerboseMode: !friendsVerboseMode })}/>
					</ul>
				</div>
			{/* ids */}
				<div>
					<h2><b>IDs:</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>clientUuid: {`${clientUuid}`} </li>
						<li>hostUuid: {`${hostUuid}`} </li>
						<li>partySocketId: {`${partySocketId}`} </li>
						<li>chatSocketId: {`${chatSocketId}`}</li>
						<li>gameSocketId: {`${gameSocketId}`}</li>
						<li>partyGameId: {`${partyGameId}`}</li>
						<li>chatRoomId: {`${chatRoomId}`}</li>
					</ul>
				</div>
			{/* validation */}
				<div>
					<h2><b>Validation:</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`authValidation: ${authValidation}`} call={() => useAuthStore.setState({ authValidation: !authValidation })}/>
						<DevButton label={`profileValidation: ${profileValidation}`} call={() => useProfileStore.setState({ profileValidation: !profileValidation })}/>
					</ul>
				</div>
			{/* data */}
				<div>
					<h2><b>Cached Datas:</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`cachedProfiles: ${Object.keys(cachedProfiles).length}`} call={() => console.log("cachedProfiles:", useProfileStore.getState().cachedProfiles)} />
						<DevButton label={`cachedStats: ${Object.keys(cachedStats).length}`} call={() => console.log("cachedStats:", cachedStats)}/>
						<DevButton label={`cachedBadges: ${Object.values(cachedBadges).filter(Boolean).length}`} call={() => console.log("cachedBadges:", cachedBadges)}/>
						<DevButton label={`cachedCreatedAts: ${Object.keys(cachedCreatedAts).length}`} call={() => console.log("cachedCreatedAts: ", cachedCreatedAts)}/>
						<DevButton label={`cachedFriends: ${cachedFriends ? cachedFriends.length : 0}`} call={() => console.log("cachedFriends: ", cachedFriends)} />
					</ul>
				</div>
		</section>
	);
}