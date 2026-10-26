import { SECRET_BADGE_IDS, type BadgeId, type SecretBadgeId } from "@big2/game-stats-types/game-stats";


export const isSecretBadgeId = (id: BadgeId): id is SecretBadgeId =>
	(SECRET_BADGE_IDS as readonly string[]).includes(id);
