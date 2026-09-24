import { useState, useEffect } from "react";
import { handleGetOnline } from "../../../api/party/get_online/handleGetOnline";
import { usePartyStore, type AVAILABILITY_TYPE } from "../../../store/PartyStore";

interface PlayerStatusModuleProps {
	uuid: string;
}

export const PlayerStatusModule = ({ uuid }: PlayerStatusModuleProps) => {
	const [ availability, setAvailability ] = useState<AVAILABILITY_TYPE | null>(null);
	const [ lastOnline, setLastOnline ] = useState<Date | null>(null);
	const availabilityOverride = usePartyStore((store) => store.availabilityOverrides[uuid]);

	useEffect(() => {
		let mounted = true;

		if (!uuid) {
			setAvailability(null);
			setLastOnline(null);
			return;
		}

		const fetchPlayerData = async () => {
			try {
				const response = await handleGetOnline(uuid);

				if (!mounted)
					return;

				if (response?.isOnline) {
					if (response?.inParty)
						setAvailability("Busy");
					else
						setAvailability("Online");
				} else {
					setAvailability("Offline");
					setLastOnline(new Date(response?.lastOnline) ?? null);
				}
			} catch (error) {
				console.error("Failed to fetch player data:", error);
			}
		};
		fetchPlayerData();

		return () => {
			mounted = false;
		};
	}, [uuid]);

	const effectiveAvailability = availabilityOverride ?? availability;

	return (
		<div
			data-tip={`Last Online: ${lastOnline?.toLocaleString()}`}
			className={`
				h-full
				flex place-content-center place-items-center
				gap-0.5rem
				${availability === "Offline" && "data-tip-up"}
		`}>
			<div
				className={`
					h-1rem aspect-square
					rounded-full
					${
						effectiveAvailability === "Offline" ? "bg-red-500" :
						effectiveAvailability === "Online" ? "bg-green-500" :
						"bg-yellow-500"
					}
				`}
			/>
			<h3 className="whitespace-nowrap">{effectiveAvailability ?? "n/a"}</h3>
		</div>
	);
}