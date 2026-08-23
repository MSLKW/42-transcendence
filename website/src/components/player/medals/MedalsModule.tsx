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

export const MedalsModule = () => {
	return (
		<div
			className="
				grid grid-cols-6 grid-rows-2
				place-content-center place-items-center
				gap-5 py-1rem px-5rem
			"
		>
			<MedalImage
				icon={<MedalHighIcon />}
				title={`'HIGH THERE!'\nBest your opponents with a high card`}
				subtitle={`Achievement Locked`}
			/>
			<MedalImage
				icon={<MedalDoubleIcon />}
				title={`'DOUBLE TAKE'\nBest your opponents with a pair`}
				subtitle={`Achievement Locked`}
			/>
			<MedalImage
				icon={<MedalTripleIcon />}
				title={`'THIRD TIME'S A CHARM'\nBest your opponents with a triple`}
				subtitle={`Achievement Locked`}
			/>
			<MedalImage
				icon={<MedalStraightIcon />}
				title={`'STRAIGHT TO THE TOP'\nBest your opponents with a straight`}
				subtitle={`Achievement Locked`}
			/>
			<MedalImage
				icon={<MedalFlushIcon />}
				title={`'SUIT YOURSELF'\nBest your opponents with a flush`}
				subtitle={`Achievement Locked`}
			/>
			<MedalImage
				icon={<Medal4OfAKindIcon />}
				title={`'FOUR MIDABLE'\nBest your opponents with a 4 of a kind`}
				subtitle={`Achievement Locked`}
			/>
			<MedalImage
				icon={<MedalFullHouseIcon />}
				title={`'NO VACANCY'\nBest your opponents with a full house`}
				subtitle={`Achievement Locked`}
			/>
			<MedalImage
				icon={<MedalStraightFlushIcon />}
				title={`'FLUSH & FURIOUS'\nBest your opponents with a straight flush`}
				subtitle={`Achievement Locked`}
			/>
			<MedalImage
				icon={<MedalFirstWinIcon />}
				title={`'DEAL WITH IT'\nWin a game`}
				subtitle={`Achievement Locked`}
			/>
			<MedalImage
				icon={<Medal3OfDiamondsIcon />}
				title={`'DIAMONDS ARE FOREVER'\nPlay 3 of diamonds`}
				subtitle={`Achievement Locked`}
			/>
			<MedalImage
				icon={<Medal2OfSpadesIcon />}
				title={`'BIG 2!'\nPlay 2 of spades`}
				subtitle={`Achievement Locked`}
			/>
			<MedalImage
				icon={<MedalNoPassIcon />}
				title={`'I'LL PASS... WAIT, NO I WON'T'\nEnd a game without passing`}
				subtitle={`Achievement Locked`}
			/>
		</div>
	);
}