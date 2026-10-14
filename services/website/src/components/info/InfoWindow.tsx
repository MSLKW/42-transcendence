import { Window } from "../window/Window";
import { ShowDevSection } from "./Dev/ShowDevSection";
import { PrivacyPolicyModule } from "./privacy_policy/PrivacyPolicy";
import { TermsOfServiceModule } from "./terms_of_service/TermsOfService";

export const InfoWindow = () => {
    return (
		<Window
			title="Additional Info"
			dismissKey="info"
			lightbox={true}
		>
			<div className="
				w-200 max-w-[80vw]
				flex place-content-center place-items-center
				pointer-events-auto
				relative
				text-n6
			">
				<div className="
					h-200 max-h-[80vh]
					px-3rem
					divide-n2/40 divide-y-2
					overflow-scroll
				">
					<PrivacyPolicyModule />
					<TermsOfServiceModule />
					<ShowDevSection />
				</div>
			</div>
		</Window>
	);
}