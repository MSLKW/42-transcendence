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
import { useBubbleStore } from "./store/BubbleStore";

export default function Dev() {
	const authAPIEnabled = useAuthStore((store) => store.authAPIEnabled);
	const authValidation = useAuthStore((store) => store.authValidation);
	const authVerboseMode = useAuthStore((store) => store.authVerboseMode);
	const cachedCreatedAts = useAuthStore((store) => store.cachedCreatedAts);
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
	
	const bubbles = useBubbleStore((store) => store.bubbles);
	
	const chatAPIEnabled = useChatStore((store) => store.chatAPIEnabled);
	const chatLog = useChatStore((store) => store.chatLog);
	const chatRoomId = useChatStore((store) => store.chatRoomId);
	const chatSocketId = useChatStore((store) => store.chatSocketId);
	const chatVerboseMode = useChatStore((store) => store.chatVerboseMode);
	const isChatRateLimited = useChatStore((store) => store.isChatRateLimited);
	
	const friendsVerboseMode = useFriendsStore((store) => store.friendsVerboseMode);
	const cachedFriends = useFriendsStore((store) => store.cachedFriends);
	
	const gameVerboseMode = useGameStore((store) => store.gameVerboseMode);
	const gameSocketId = useGameStore((store) => store.gameSocketId);
	const cachedStats = useGameStatsStore((store) => store.cachedStats);
	const cachedBadges = useGameStatsStore((store) => store.cachedBadges);
	const gameStatsVerboseMode = useGameStatsStore((store) => store.gameStatsVerboseMode);
	
	const notifications = useNotificationStore((store) => store.notifications);
	
	const availabilityOverrides = usePartyStore((store) => store.availabilityOverrides);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const members = usePartyStore((store) => store.members);
	const partyAPIEnabled = usePartyStore((store) => store.partyAPIEnabled);
	const partyGameId = usePartyStore((store) => store.partyGameId);
	const partySocketId = usePartyStore((store) => store.partySocketId);
	const partyVerboseMode = usePartyStore((store) => store.partyVerboseMode);
	
	const profileValidation = useProfileStore((store) => store.profileValidation);
	const profileVerboseMode = useProfileStore((store) => store.profileVerboseMode);
	const cachedProfiles = useProfileStore((store) => store.cachedProfiles);

	const sceneVerboseMode = useSceneStore((store) => store.sceneVerboseMode);

	const toggleAllVerbose = useRef(false);
	const toggleAllAPI = useRef(false);

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
							toggleAllVerbose.current = !toggleAllVerbose.current;
							useSceneStore.setState({ sceneVerboseMode: toggleAllVerbose.current });
							useAuthStore.setState({ authVerboseMode: toggleAllVerbose.current })
							useProfileStore.setState({ profileVerboseMode: toggleAllVerbose.current })
							useGameStatsStore.setState({ gameStatsVerboseMode: toggleAllVerbose.current })
							usePartyStore.setState({ partyVerboseMode: toggleAllVerbose.current })
							useGameStore.setState({ gameVerboseMode: toggleAllVerbose.current })
							useChatStore.setState({ chatVerboseMode: toggleAllVerbose.current })
							useFriendsStore.setState({ friendsVerboseMode: toggleAllVerbose.current })
						}}/>
						<DevButton label={`auth: ${authVerboseMode}`} call={() => useAuthStore.setState({ authVerboseMode: !authVerboseMode })}/>
						<DevButton label={`chat: ${chatVerboseMode}`} call={() => useChatStore.setState({ chatVerboseMode: !chatVerboseMode })}/>
						<DevButton label={`friends: ${friendsVerboseMode}`} call={() => useFriendsStore.setState({ friendsVerboseMode: !friendsVerboseMode })}/>
						<DevButton label={`game: ${gameVerboseMode}`} call={() => useGameStore.setState({ gameVerboseMode: !gameVerboseMode })}/>
						<DevButton label={`game-stats: ${gameStatsVerboseMode}`} call={() => useGameStatsStore.setState({ gameStatsVerboseMode: !gameStatsVerboseMode })}/>
						<DevButton label={`party: ${partyVerboseMode}`} call={() => usePartyStore.setState({ partyVerboseMode: !partyVerboseMode })}/>
						<DevButton label={`profile: ${profileVerboseMode}`} call={() => useProfileStore.setState({ profileVerboseMode: !profileVerboseMode })}/>
						<DevButton label={`scene: ${sceneVerboseMode}`} call={() => useSceneStore.setState({ sceneVerboseMode: !sceneVerboseMode })}/>
					</ul>
				</div>
			{/* ids */}
				<div>
					<h2><b>IDs:</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>clientUuid: {`${clientUuid}`} </li>
						<li>hostUuid: {`${hostUuid}`} </li>
						<li>chatRoomId: {`${chatRoomId}`}</li>
						<li>chatSocketId: {`${chatSocketId}`}</li>
						<li>gameSocketId: {`${gameSocketId}`}</li>
						<li>partyGameId: {`${partyGameId}`}</li>
						<li>partySocketId: {`${partySocketId}`} </li>
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
			{/* service api */}
				<div>
					<h2><b>API Enabled:</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`toggle all`} call={() => {
							toggleAllAPI.current = !toggleAllAPI.current;
							useAuthStore.setState({ authAPIEnabled: toggleAllAPI.current });
							useChatStore.setState({ chatAPIEnabled: toggleAllAPI.current });
							usePartyStore.setState({ partyAPIEnabled: toggleAllAPI.current });
						}}/>
						<DevButton label={`auth: ${authAPIEnabled}`} call={() => useAuthStore.setState({ authAPIEnabled: !authAPIEnabled })}/>
						<DevButton label={`chat: ${chatAPIEnabled}`} call={() => useChatStore.setState({ chatAPIEnabled: !chatAPIEnabled })}/>
						<DevButton label={`party: ${partyAPIEnabled}`} call={() => usePartyStore.setState({ partyAPIEnabled: !partyAPIEnabled })}/>
					</ul>
				</div>
			{/* cached datas */}
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
			{/* additional datas */}
				<div>
					<h2><b>Additional Datas:</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>isAuthenticated: {`${isAuthenticated}`}</li>
						<DevButton label={`members: ${Object.keys(members).length}`} call={() => console.log("members:", members) }/>
						<DevButton label={`availabilityOverrides: ${Object.keys(availabilityOverrides).length}`} call={() => console.log("availabilityOverrides:", availabilityOverrides) }/>
						<DevButton label={`bubbles: ${Object.values(bubbles).flatMap(b => b).length}`} call={() => console.log("bubbles:", bubbles) }/>
						<DevButton label={`clearBubbles`} call={() => useBubbleStore.getState().clearBubbles(clientUuid!) }/>
						<DevButton label={`chatLog: ${Object.values(chatLog).flatMap(b => b).length}`} call={() => console.log("chatLog:", chatLog) }/>
						<DevButton label={`isChatRateLimited: ${Object.keys(bubbles).length}`} call={() => console.log("isChatRateLimited:", isChatRateLimited) }/>
					</ul>
				</div>
		</section>
	);
}