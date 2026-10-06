import { useProfileStore } from "../../../store/ProfileStore";
import { MedalImage } from "./MedalImage";
import { MedalHighIcon } from "./icons/MedalHighIcon";
import { MedalDoubleIcon } from "./icons/MedalDoubleIcon";
import { MedalTripleIcon } from "./icons/MedalTripleIcon";
import { MedalStraightIcon } from "./icons/MedalStraight";
import { MedalFlushIcon } from "./icons/MedalFlushIcon";
import { Medal4OfAKindIcon } from "./icons/Medal4OfAKind";
import { MedalFullHouseIcon } from "./icons/MedalFullHouseIcon";
import { MedalStraightFlushIcon } from "./icons/MedalStraightFlush";
import { MedalFirstWinIcon } from "./icons/MedalFirstWin";
import { Medal3OfDiamondsIcon } from "./icons/Medal3OfDiamondsHand";
import { Medal2OfSpadesIcon } from "./icons/Medal2OfSpadesIcon";
import { MedalNoPassIcon } from "./icons/MedalNoPassIcon";

interface MedalsModuleProps {
	uuid: string | null;
}
export const MedalsModule = ({ uuid }: MedalsModuleProps) => {
	const getProfileData = useProfileStore((store) => store.getProfileData);

	const medals = getProfileData(uuid)?.medals;

	return (
		<div
			className="
				grid grid-cols-6 grid-rows-2
				place-content-center place-items-center
				gap-5 py-1rem px-5rem relative
			"
		>
			<MedalImage
				icon={<MedalHighIcon />}
				title="'HIGH THERE'"
				description="Best your opponents with a high card"
				date={medals?.["High"] ?? undefined}
			/>
			<MedalImage
				icon={<MedalDoubleIcon />}
				title="'DOUBLE TAKE'"
				description="Best your opponents with a pair"
				date={medals?.["Double"] ?? undefined}
			/>
			<MedalImage
				icon={<MedalTripleIcon />}
				title="'THIRD TIME'S A CHARM'"
				description="'Best your opponents with a triple"
				date={medals?.["Triple"] ?? undefined}
			/>
			<MedalImage
				icon={<MedalStraightIcon />}
				title="'STRAIGHT TO THE TOP'"
				description="Best your opponents with a straight"
				date={medals?.["Straight"] ?? undefined}
			/>
			<MedalImage
				icon={<MedalFlushIcon />}
				title="'SUIT YOURSELF'"
				description="Best your opponents with a flush"
				date={medals?.["Flush"] ?? undefined}
			/>
			<MedalImage
				icon={<MedalFullHouseIcon />}
				title="'NO VACANCY'"
				description="Best your opponents with a full house"
				date={medals?.["Full House"] ?? undefined}
			/>
			<MedalImage
				icon={<Medal4OfAKindIcon />}
				title="'FOUR MIDABLE'"
				description="Best your opponents with a 4 of a kind"
				date={medals?.["4 Of A Kind"] ?? undefined}
			/>
			<MedalImage
				icon={<MedalStraightFlushIcon />}
				title="'FLUSH & FURIOUS'"
				description="Best your opponents with a straight flush"
				date={medals?.["Straight Flush"] ?? undefined}
			/>
			<MedalImage
				icon={<MedalFirstWinIcon />}
				title="'DEAL WITH IT'"
				description="Win a game"
				date={medals?.["First Win"] ?? undefined}
			/>
			<MedalImage
				icon={<Medal3OfDiamondsIcon />}
				title="'DIAMONDS ARE FOREVER"
				description="Play 3 of diamonds"
				date={medals?.["3 Of Diamonds"] ?? undefined}
			/>
			<MedalImage
				icon={<Medal2OfSpadesIcon />}
				title="'BIG 2!'"
				description="Play 2 of spades"
				date={medals?.["2 Of Spades"] ?? undefined}
			/>
			<MedalImage
				icon={<MedalNoPassIcon />}
				title="'I'LL PASS... WAIT, NO I WON'T'"
				description="End a game without passing"
				date={medals?.["No Pass"] ?? undefined}
			/>
		</div>
	);
}