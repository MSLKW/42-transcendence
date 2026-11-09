import { useRef } from "react";
import { useAuthStore } from "./store/AuthStore";
import { useBotStore } from "./store/BotStore";
import { useBubbleStore } from "./store/BubbleStore";
import { useChatStore } from "./store/ChatStore";
import { useDevStore } from "./store/DevStore";
import { useFriendsStore } from "./store/FriendsStore";
import { useGameStatsStore } from "./store/GameStatsStore";
import { useGameStore } from "./store/GameStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "./store/NotificationStore";
import { usePartyStore } from "./store/PartyStore";
import { useProfileStore } from "./store/ProfileStore";
import { useSceneStore } from "./store/SceneStore";
import { useTypingStore } from "./store/TypingStore";
import { DevButton } from "./components/dev/DevBtn";
import { useFrameView } from "./utilities/react/useFrameView";

export default function Dev() {
	const authAPIConnection = useAuthStore((store) => store.authAPIConnection);
	const authValidation = useAuthStore((store) => store.authValidation);
	const authVerboseMode = useAuthStore((store) => store.authVerboseMode);
	const cachedCreatedAts = useAuthStore((store) => store.cachedCreatedAts);
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

	const botCount = useBotStore((store) => store.botCount);

	const bubbles = useBubbleStore((store) => store.bubbles);

	const chatAPIConnection = useChatStore((store) => store.chatAPIConnection);
	const chatLog = useChatStore((store) => store.chatLog);
	const chatRoomId = useChatStore((store) => store.chatRoomId);
	const chatSocketId = useChatStore((store) => store.chatSocketId);
	const chatVerboseMode = useChatStore((store) => store.chatVerboseMode);
	const isChatRateLimited = useChatStore((store) => store.isChatRateLimited);
	
	const cachedFriends = useFriendsStore((store) => store.cachedFriends);
	const friendRequestSent = useFriendsStore((store) => store.friendRequestSent);
	const friendsAPIConnection = useFriendsStore((store) => store.friendsAPIConnection);
	const friendsVerboseMode = useFriendsStore((store) => store.friendsVerboseMode);
	
	const gameAPIConnection = useGameStore((store) => store.gameAPIConnection);
	const gameSocketId = useGameStore((store) => store.gameSocketId);
	const gameVerboseMode = useGameStore((store) => store.gameVerboseMode);

	const cachedStats = useGameStatsStore((store) => store.cachedStats);
	const cachedBadges = useGameStatsStore((store) => store.cachedBadges);
	const gameStatsAPIConnection = useGameStatsStore((store) => store.gameStatsAPIConnection);
	const gameStatsVerboseMode = useGameStatsStore((store) => store.gameStatsVerboseMode);
	
	const availabilityOverrides = usePartyStore((store) => store.availabilityOverrides);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const members = usePartyStore((store) => store.members);
	const partyAPIConnection = usePartyStore((store) => store.partyAPIConnection);
	const partyGameId = usePartyStore((store) => store.partyGameId);
	const partySocketId = usePartyStore((store) => store.partySocketId);
	const partyVerboseMode = usePartyStore((store) => store.partyVerboseMode);
	
	const profileAPIConnection = useProfileStore((store) => store.profileAPIConnection);
	const profileValidation = useProfileStore((store) => store.profileValidation);
	const profileVerboseMode = useProfileStore((store) => store.profileVerboseMode);
	const cachedProfiles = useProfileStore((store) => store.cachedProfiles);
	const avatarVersions = useProfileStore((store) => store.avatarVersions);

	const currentScene = useSceneStore((store) => store.currentScene);
	const playerStatsUuid = useSceneStore((store) => store.playerStatsUuid);
	const sceneVerboseMode = useSceneStore((store) => store.sceneVerboseMode);
	const showWindow = useSceneStore((store) => store.showWindow);

	const typingUsers = useTypingStore((store) => store.typingUsers);

	const toggleAPIConnection = useRef(true);
	const toggleAllVerbose = useRef(false);

	useFrameView();

	return (
		<section className="w-full text-b4 py-1rem gap-1rem flex flex-col px-3rem bg-n0 gap-10">
			{/* verbose mode */}
				<div>
					<h2><b>Toggle All ...</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connections: ${toggleAPIConnection.current}`} call={() => {
							toggleAPIConnection.current = !toggleAPIConnection.current;
							useAuthStore.setState({ authAPIConnection: toggleAPIConnection.current });
							useChatStore.setState({ chatAPIConnection: toggleAPIConnection.current })
							useFriendsStore.setState({ friendsAPIConnection: toggleAPIConnection.current })
							useGameStore.setState({ gameAPIConnection: toggleAPIConnection.current })
							useGameStatsStore.setState({ gameStatsAPIConnection: toggleAPIConnection.current })
							usePartyStore.setState({ partyAPIConnection: toggleAPIConnection.current })
							useProfileStore.setState({ profileAPIConnection: toggleAPIConnection.current })
						}}/>
						<DevButton label={`Verbose Modes: ${toggleAllVerbose.current}`} call={() => {
							toggleAllVerbose.current = !toggleAllVerbose.current;
							useAuthStore.setState({ authVerboseMode: toggleAllVerbose.current })
							useChatStore.setState({ chatVerboseMode: toggleAllVerbose.current })
							useFriendsStore.setState({ friendsVerboseMode: toggleAllVerbose.current })
							useGameStore.setState({ gameVerboseMode: toggleAllVerbose.current })
							useGameStatsStore.setState({ gameStatsVerboseMode: toggleAllVerbose.current })
							usePartyStore.setState({ partyVerboseMode: toggleAllVerbose.current })
							useProfileStore.setState({ profileVerboseMode: toggleAllVerbose.current })
							useSceneStore.setState({ sceneVerboseMode: toggleAllVerbose.current });
						}}/>
					</ul>
					<ul className="flex flex-wrap place-content-between gap-x-20">
					</ul>
				</div>
			{/* auth */}
				<div className={`
					${authAPIConnection ? "" : "opacity-60"}
					${authVerboseMode ? "text-c4" : "text-b4"}
				`}>
					<h2><b>Auth</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connection: ${authAPIConnection}`} call={() => useAuthStore.setState({ authAPIConnection: !authAPIConnection })}/>
						<DevButton label={`Frontend Validation: ${authValidation}`} call={() => useAuthStore.setState({ authValidation: !authValidation })}/>
						<DevButton label={`Verbose Mode: ${authVerboseMode}`} call={() => useAuthStore.setState({ authVerboseMode: !authVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>isAuthenticated: {`${isAuthenticated}`}</li>
						<li>clientUuid: {`${clientUuid}`} </li>
						<DevButton label={`cachedCreatedAts: ${Object.keys(cachedCreatedAts).length}`} call={() => console.log("cachedCreatedAts: ", cachedCreatedAts)}/>
					</ul>
				</div>
			{/* chat */}
				<div className={`
					${chatAPIConnection ? "" : "opacity-60"}
					${chatVerboseMode ? "text-c4" : "text-b4"}
				`}>
					<h2><b>Chat</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connection: ${chatAPIConnection}`} call={() => useChatStore.setState({ chatAPIConnection: !chatAPIConnection })}/>
						<DevButton label={`Verbose Mode: ${chatVerboseMode}`} call={() => useChatStore.setState({ chatVerboseMode: !chatVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>chatSocketId: {`${chatSocketId}`}</li>
						<li>chatRoomId: {`${chatRoomId}`}</li>
						<DevButton label={`chatLog: ${Object.values(chatLog).flatMap(b => b).length}`} call={() => console.log("chatLog:", chatLog) }/>
						<DevButton label={`isChatRateLimited: ${Object.keys(bubbles).length}`} call={() => console.log("isChatRateLimited:", isChatRateLimited) }/>
						<DevButton label={`bubbles: ${Object.values(bubbles).flatMap(b => b).length}`} call={() => console.log("bubbles:", bubbles) }/>
					</ul>
				</div>
			{/* friends */}
				<div className={`
					${friendsAPIConnection ? "" : "opacity-60"}
					${friendsVerboseMode ? "text-c4" : "text-b4"}
				`}>
					<h2><b>Friends</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connection: ${friendsAPIConnection}`} call={() => useFriendsStore.setState({ friendsAPIConnection: !friendsAPIConnection })}/>
						<DevButton label={`Verbose Mode: ${friendsVerboseMode}`} call={() => useFriendsStore.setState({ friendsVerboseMode: !friendsVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`cachedFriends: ${cachedFriends ? cachedFriends.length : 0}`} call={() => console.log("cachedFriends: ", cachedFriends)} />
						<DevButton label={`friendRequestSent: ${friendRequestSent.filter((item: any) => item.status === "Pending").length}`} call={() => console.log("friendRequestSent:", friendRequestSent) }/>
					</ul>
				</div>
			{/* game stats */}
				<div className={`
					${gameStatsAPIConnection ? "" : "opacity-60"}
					${gameStatsVerboseMode ? "text-c4" : "text-b4"}
				`}>
					<h2><b>Game Stats</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connection: ${gameStatsAPIConnection}`} call={() => useGameStatsStore.setState({ gameStatsAPIConnection: !gameStatsAPIConnection })}/>
						<DevButton label={`Verbose Mode: ${gameStatsVerboseMode}`} call={() => useGameStatsStore.setState({ gameStatsVerboseMode: !gameStatsVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`cachedStats: ${Object.keys(cachedStats).length}`} call={() => console.log("cachedStats:", cachedStats)}/>
						<DevButton label={`cachedBadges: ${Object.values(cachedBadges).filter(Boolean).length}`} call={() => console.log("cachedBadges:", cachedBadges)}/>
					</ul>
				</div>
			{/* game */}
				<div className={`
					${gameAPIConnection ? "" : "opacity-60"}
					${gameVerboseMode ? "text-c4" : "text-b4"}
				`}>
					<h2><b>Game</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connection: ${gameAPIConnection}`} call={() => useGameStore.setState({ gameAPIConnection: !gameAPIConnection })}/>
						<DevButton label={`Verbose Mode: ${gameVerboseMode}`} call={() => useGameStore.setState({ gameVerboseMode: !gameVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>gameSocketId: {`${gameSocketId}`}</li>
						<li>botCount: {`${botCount}`}</li>
					</ul>
				</div>
			{/* notification */}
				<div>
					<h2><b>Notification</b></h2>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label="Notify Message" call={() => useNotificationStore.getState().showNotification("This is a message notification", NOTIFICATION_TYPE.message)} />
						<DevButton label="Notify Error" call={() => useNotificationStore.getState().showNotification("This is an error notification", NOTIFICATION_TYPE.error)} />
					</ul>
				</div>
			{/* party */}
				<div className={`
					${partyAPIConnection ? "" : "opacity-60"}
					${partyVerboseMode ? "text-c4" : "text-b4"}
				`}>
					<h2><b>Party</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connection: ${partyAPIConnection}`} call={() => usePartyStore.setState({ partyAPIConnection: !partyAPIConnection })}/>
						<DevButton label={`Verbose Mode: ${partyVerboseMode}`} call={() => usePartyStore.setState({ partyVerboseMode: !partyVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>partySocketId: {`${partySocketId}`} </li>
						<li>hostUuid: {`${hostUuid}`} </li>
						<li>partyGameId: {`${partyGameId}`}</li>
						<DevButton label={`members: ${Object.keys(members).length}`} call={() => console.log("members:", members) }/>
						<DevButton label={`availabilityOverrides: ${Object.keys(availabilityOverrides).length}`} call={() => console.log("availabilityOverrides:", availabilityOverrides) }/>
					</ul>
				</div>
			{/* profile */}
				<div className={`
					${profileAPIConnection ? "" : "opacity-60"}
					${profileVerboseMode ? "text-c4" : "text-b4"}
				`}>
					<h2><b>Profile</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connection: ${profileAPIConnection}`} call={() => useProfileStore.setState({ profileAPIConnection: !profileAPIConnection })}/>
						<DevButton label={`Frontend Validation: ${profileValidation}`} call={() => useProfileStore.setState({ profileValidation: !profileValidation })}/>
						<DevButton label={`Verbose Mode: ${profileVerboseMode}`} call={() => useProfileStore.setState({ profileVerboseMode: !profileVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`cachedProfiles: ${Object.keys(cachedProfiles).length}`} call={() => console.log("cachedProfiles:", useProfileStore.getState().cachedProfiles)} />
						<DevButton label={`avatarVersions: ${Object.keys(avatarVersions).length}`} call={() => console.log("avatarVersions:", useProfileStore.getState().avatarVersions)} />
					</ul>
				</div>
			{/* scene */}
				<div className={`
					${gameVerboseMode ? "text-c4" : "text-b4"}
				`}>
					<h2><b>Scene</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`Verbose Mode: ${sceneVerboseMode}`} call={() => useSceneStore.setState({ sceneVerboseMode: !sceneVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>currentScene: {`${currentScene}`}</li>
						<DevButton label="Frame" call={() => useDevStore.setState((store) => ({ showFrame: !store.showFrame }))} />
						<DevButton label={`showWindow: ${Object.values(showWindow).filter(Boolean).length}`} call={() => console.log("showWindow:", showWindow)} />
						<li>playerStatsUuid: {`${playerStatsUuid}`}</li>
					</ul>
				</div>
			{/* scene */}
				<div>
					<h2><b>Typing Store</b></h2>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`typingUsers: ${Object.entries(typingUsers).filter(([_, isTyping]) => isTyping).map(([uuid]) => uuid).length}`} call={() => console.log("typingUsers:", typingUsers)} />
					</ul>
				</div>
		</section>
	);
}