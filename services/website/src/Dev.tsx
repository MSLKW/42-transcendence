import { useRef } from "react";
import { useAuthStore } from "./store/AuthStore";
import { useBotStore } from "./store/BotStore";
import { useBubbleStore } from "./store/BubbleStore";
import { useChatStore } from "./store/ChatStore";
import { useFriendsStore } from "./store/FriendsStore";
import { useGameStatsStore } from "./store/GameStatsStore";
import { useGameStore } from "./store/GameStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "./store/NotificationStore";
import { usePartyStore } from "./store/PartyStore";
import { useProfileStore } from "./store/ProfileStore";
import { useResultsStore } from "./store/ResultsStore";
import { useSceneStore } from "./store/SceneStore";
import { useTypingStore } from "./store/TypingStore";
import { DevButton } from "./components/dev/DevBtn";
import { useFrameView } from "./utilities/react/useFrameView";
import { useSettingsStore } from "./store/SettingsStore";

export default function Dev() {
	const authAPIConnection = useAuthStore((store) => store.authAPIConnection);
	const authFrontendValidation = useAuthStore((store) => store.authFrontendValidation);
	const authVerboseMode = useAuthStore((store) => store.authVerboseMode);
	const cachedCreatedAts = useAuthStore((store) => store.cachedCreatedAts);
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

	const botCount = useBotStore((store) => store.botCount);

	const bubbles = useBubbleStore((store) => store.bubbles);

	const chatAPIConnection = useChatStore((store) => store.chatAPIConnection);
	const chatLog = useChatStore((store) => store.chatLog);
	const chatPlayerCount = useChatStore((store) => store.chatPlayerCount);
	const chatRoomId = useChatStore((store) => store.chatRoomId);
	const chatSocketId = useChatStore((store) => store.chatSocketId);
	const chatVerboseMode = useChatStore((store) => store.chatVerboseMode);
	const isChatRateLimited = useChatStore((store) => store.isChatRateLimited);

	const cachedFriends = useFriendsStore((store) => store.cachedFriends);
	const friendRequestSent = useFriendsStore((store) => store.friendRequestSent);
	const friendsAPIConnection = useFriendsStore((store) => store.friendsAPIConnection);
	const friendsVerboseMode = useFriendsStore((store) => store.friendsVerboseMode);
	const isFriendsConnected = useFriendsStore((store) => store.isFriendsConnected);
	
	const gameAPIConnection = useGameStore((store) => store.gameAPIConnection);
	const gameSocketId = useGameStore((store) => store.gameSocketId);
	const gameVerboseMode = useGameStore((store) => store.gameVerboseMode);
	const totalPlayers = useGameStore((store) => store.totalPlayers);
	const gameSeats = useGameStore((store) => store.gameSeats);
	const userSeats = useGameStore((store) => store.userSeats);
	const playerDisconnection = useGameStore((store) => store.playerDisconnection);
	const gameStarted = useGameStore((store) => store.gameStarted);
	const cardsLeft = useGameStore((store) => store.cardsLeft);
	const currentHand = useGameStore((store) => store.currentHand);
	const selectedCards = useGameStore((store) => store.selectedCards);
	const cardHeapTopCards = useGameStore((store) => store.cardHeapTopCards);
	const lowestCardRequired = useGameStore((store) => store.lowestCardRequired);
	const round = useGameStore((store) => store.round);
	const seatRef = useGameStore((store) => store.seatRef);
	const activeSeat = useGameStore((store) => store.activeSeat);
	const isActiveSeatSkippable = useGameStore((store) => store.isActiveSeatSkippable);
	const isCardHandPlayable = useGameStore((store) => store.isCardHandPlayable);
	const sortType = useGameStore((store) => store.sortType);
	const playerPassed = useGameStore((store) => store.playerPassed);
	const playerTimer = useGameStore((store) => store.playerTimer);
	const playerRemainingTimer = useGameStore((store) => store.playerRemainingTimer);

	const cachedStats = useGameStatsStore((store) => store.cachedStats);
	const cachedBadges = useGameStatsStore((store) => store.cachedBadges);
	const gameStatsAPIConnection = useGameStatsStore((store) => store.gameStatsAPIConnection);
	const gameStatsVerboseMode = useGameStatsStore((store) => store.gameStatsVerboseMode);
	
	const notifications = useNotificationStore((store) => store.notifications);
	const isNotifFiltered = useNotificationStore((store) => store.isNotifFiltered);

	const availabilityOverrides = usePartyStore((store) => store.availabilityOverrides);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const members = usePartyStore((store) => store.members);
	const partyAPIConnection = usePartyStore((store) => store.partyAPIConnection);
	const partyGameId = usePartyStore((store) => store.partyGameId);
	const partySocketId = usePartyStore((store) => store.partySocketId);
	const partyVerboseMode = usePartyStore((store) => store.partyVerboseMode);
	
	const profileAPIConnection = useProfileStore((store) => store.profileAPIConnection);
	const profileFrontendValidation = useProfileStore((store) => store.profileFrontendValidation);
	const profileVerboseMode = useProfileStore((store) => store.profileVerboseMode);
	const cachedProfiles = useProfileStore((store) => store.cachedProfiles);
	const avatarVersions = useProfileStore((store) => store.avatarVersions);

	const results = useResultsStore((store) => store.results);

	const currentScene = useSceneStore((store) => store.currentScene);
	const playerStatsUuid = useSceneStore((store) => store.playerStatsUuid);
	const sceneVerboseMode = useSceneStore((store) => store.sceneVerboseMode);
	const showWindow = useSceneStore((store) => store.showWindow);

	const allow3OfAKind = useSettingsStore((store) => store.allow3OfAKind);
	const allow2OfSpadesEnd = useSettingsStore((store) => store.allow2OfSpadesEnd);
	const autoPassIndex = useSettingsStore((store) => store.autoPassIndex);

	const typingUsers = useTypingStore((store) => store.typingUsers);

	const toggleAPIConnection = useRef(true);
	const toggleAllVerbose = useRef(false);

	useFrameView();

	return (
		<section className="w-full text-a4 py-1rem gap-1rem flex flex-col px-3rem bg-n0 gap-10">
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
					${clientUuid ? "text-a4" : "text-b4"}
					${authVerboseMode ? "font-extrabold" : ""}
				`}>
					<h2><b>Auth</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connection: ${authAPIConnection}`} call={() => useAuthStore.setState({ authAPIConnection: !authAPIConnection })}/>
						<DevButton label={`Frontend Validation: ${authFrontendValidation}`} call={() => useAuthStore.setState({ authFrontendValidation: !authFrontendValidation })}/>
						<DevButton label={`Verbose Mode: ${authVerboseMode}`} call={() => useAuthStore.setState({ authVerboseMode: !authVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>clientUuid: {`${clientUuid}`} </li>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>isAuthenticated: {`${isAuthenticated}`}</li>
						<DevButton label={`cachedCreatedAts: ${Object.keys(cachedCreatedAts).length}`} call={() => console.log("cachedCreatedAts: ", cachedCreatedAts)}/>
					</ul>
				</div>
			{/* chat */}
				<div className={`
					${chatAPIConnection ? "" : "opacity-60"}
					${(chatSocketId && chatRoomId) ? "text-c4" : "text-b4"}
					${chatVerboseMode ? "font-extrabold" : ""}
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
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`bubbles: ${Object.values(bubbles).flatMap(b => b).length}`} call={() => console.log("bubbles:", bubbles) }/>
						<li>chatPlayerCount: {`${chatPlayerCount}`}</li>
						<DevButton label={`chatLog: ${Object.values(chatLog).flatMap(b => b).length}`} call={() => console.log("chatLog:", chatLog) }/>
						<DevButton label={`isChatRateLimited: ${Object.keys(bubbles).length}`} call={() => console.log("isChatRateLimited:", isChatRateLimited) }/>
						<DevButton label={`typingUsers: ${Object.entries(typingUsers).filter(([_, isTyping]) => isTyping).map(([uuid]) => uuid).length}`} call={() => console.log("typingUsers:", typingUsers)} />
					</ul>
				</div>
			{/* friends */}
				<div className={`
					${friendsAPIConnection ? "" : "opacity-60"}
					${isFriendsConnected ? "text-c4" : "text-b4"}
					${friendsVerboseMode ? "font-extrabold" : ""}
				`}>
					<h2><b>Friends</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connection: ${friendsAPIConnection}`} call={() => useFriendsStore.setState({ friendsAPIConnection: !friendsAPIConnection })}/>
						<DevButton label={`Verbose Mode: ${friendsVerboseMode}`} call={() => useFriendsStore.setState({ friendsVerboseMode: !friendsVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`cachedFriends: ${cachedFriends ? cachedFriends.length : 0}`} call={() => console.log("cachedFriends: ", cachedFriends)} />
						<li>{`isFriendsConnected: ${isFriendsConnected}`}</li>
						<DevButton label={`friendRequestSent: ${friendRequestSent.filter((item: any) => item.status === "Pending").length}`} call={() => console.log("friendRequestSent:", friendRequestSent) }/>
					</ul>
				</div>
			{/* game */}
				<div className={`
					${gameAPIConnection ? "" : "opacity-60"}
					${gameSocketId ? "text-c4" : "text-b4"}
					${gameVerboseMode ? "font-extrabold" : ""}
				`}>
					<h2><b>Game</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connection: ${gameAPIConnection}`} call={() => useGameStore.setState({
							gameAPIConnection: !gameAPIConnection,
							gameSocketId: null,
						})}/>
						<DevButton label={`Verbose Mode: ${gameVerboseMode}`} call={() => useGameStore.setState({ gameVerboseMode: !gameVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>gameSocketId: {`${gameSocketId}`}</li>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`activeSeat: ${activeSeat}`} call={() => console.log("activeSeat:", activeSeat)}/>
						<li>botCount: {`${botCount}`}</li>
						<DevButton label={`allow3OfAKind: ${allow3OfAKind}`} call={() => console.log("allow3OfAKind:", allow3OfAKind)}/>
						<DevButton label={`allow2OfSpadesEnd: ${allow2OfSpadesEnd}`} call={() => console.log("allow2OfSpadesEnd:", allow2OfSpadesEnd)}/>
						<DevButton label={`autoPassIndex: ${autoPassIndex}`} call={() => console.log("autoPassIndex:", autoPassIndex)}/>
						<DevButton label={`cardHeapTopCards: ${cardHeapTopCards?.cards.length}`} call={() => console.log("cardHeapTopCards:", cardHeapTopCards)}/>
						<DevButton label={`cardsLeft: ${cardsLeft}`} call={() => console.log("cardsLeft:", cardsLeft)}/>
						<DevButton label={`currentHand: ${currentHand}`} call={() => console.log("currentHand:", currentHand)}/>
						<DevButton label={`gameSeats: ${gameSeats.length}`} call={() => console.log("gameSeats:", gameSeats)}/>
						<DevButton label={`gameStarted: ${gameStarted}`} call={() => console.log("gameStarted:", gameStarted)}/>
						<DevButton label={`isActiveSeatSkippable: ${isActiveSeatSkippable}`} call={() => console.log("isActiveSeatSkippable:", isActiveSeatSkippable)}/>
						<DevButton label={`isCardHandPlayable: ${isCardHandPlayable}`} call={() => console.log("isCardHandPlayable:", isCardHandPlayable)}/>
						<DevButton label={`lowestCardRequired: ${lowestCardRequired}`} call={() => console.log("lowestCardRequired:", lowestCardRequired)}/>
						<DevButton label={`playerDisconnection: ${Object.values(playerDisconnection).filter(Boolean).length}`} call={() => console.log("playerDisconnection:", playerDisconnection)}/>
						<DevButton label={`playerPassed: ${playerPassed.length}`} call={() => console.log("playerPassed:", playerPassed)}/>
						<DevButton label={`playerRemainingTimer: ${playerRemainingTimer}`} call={() => console.log("playerRemainingTimer:", playerRemainingTimer)}/>
						<DevButton label={`playerTimer: ${playerTimer}`} call={() => console.log("playerTimer:", playerTimer)}/>
						<DevButton label={`results: ${Object.keys(results).length}`} call={() => console.log("results:", results)}/>
						<DevButton label={`round: ${round}`} call={() => console.log("round:", round)}/>
						<DevButton label={`seatRef: ${seatRef}`} call={() => console.log("seatRef:", seatRef)}/>
						<DevButton label={`sortType: ${sortType}`} call={() => console.log("sortType:", sortType)}/>
						<DevButton label={`selectedCards: ${selectedCards?.cards.length}`} call={() => console.log("selectedCards:", selectedCards)}/>
						<DevButton label={`totalPlayers: ${totalPlayers}`} call={() => console.log("totalPlayers:", totalPlayers)}/>
						<DevButton label={`userSeats: ${userSeats.length}`} call={() => console.log("userSeats:", userSeats)}/>
					</ul>
				</div>
			{/* game stats */}
				<div className={`
					${gameStatsAPIConnection ? "" : "opacity-60"}
					${gameStatsVerboseMode ? "font-extrabold" : ""}
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
			{/* notification */}
				<div>
					<h2><b>Notification</b></h2>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label="Notify Message" call={() => useNotificationStore.getState().showNotification("This is a message notification", NOTIFICATION_TYPE.message)} />
						<DevButton label="Notify Error" call={() => useNotificationStore.getState().showNotification("This is an error notification", NOTIFICATION_TYPE.error)} />
						<DevButton label={`notifications: ${notifications.length}`} call={() => console.log("notifications:", notifications)} />
						<li>{`isNotifFiltered: ${isNotifFiltered}`}</li>
					</ul>
				</div>
			{/* party */}
				<div className={`
					${partyAPIConnection ? "" : "opacity-60"}
					${(partySocketId && hostUuid) ? "text-c4" : "text-b4"}
					${partyVerboseMode ? "font-extrabold" : ""}
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
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`members: ${Object.keys(members).length}`} call={() => console.log("members:", members) }/>
						<DevButton label={`availabilityOverrides: ${Object.keys(availabilityOverrides).length}`} call={() => console.log("availabilityOverrides:", availabilityOverrides) }/>
					</ul>
				</div>
			{/* profile */}
				<div className={`
					${profileAPIConnection ? "" : "opacity-60"}
					${profileVerboseMode ? "font-extrabold" : ""}
				`}>
					<h2><b>Profile</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`API Connection: ${profileAPIConnection}`} call={() => useProfileStore.setState({ profileAPIConnection: !profileAPIConnection })}/>
						<DevButton label={`Frontend Validation: ${profileFrontendValidation}`} call={() => useProfileStore.setState({ profileFrontendValidation: !profileFrontendValidation })}/>
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
					${gameVerboseMode ? "font-extrabold" : ""}
				`}>
					<h2><b>Scene</b></h2>
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<DevButton label={`Verbose Mode: ${sceneVerboseMode}`} call={() => useSceneStore.setState({ sceneVerboseMode: !sceneVerboseMode })}/>
					</ul>
					<hr />
					<ul className="flex flex-wrap place-content-between gap-x-20">
						<li>currentScene: {`${currentScene}`}</li>
						<DevButton label="Frame" call={() => useSceneStore.setState((store) => ({ showFrame: !store.showFrame }))} />
						<DevButton label={`showWindow: ${Object.values(showWindow).filter(Boolean).length}`} call={() => console.log("showWindow:", showWindow)} />
						<li>playerStatsUuid: {`${playerStatsUuid}`}</li>
					</ul>
				</div>
		</section>
	);
}