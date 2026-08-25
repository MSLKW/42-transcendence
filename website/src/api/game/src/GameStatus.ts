import { GameEndStatsTransmit } from '@big2/game-types';
import { Player } from './Player.ts';

export class GameStatus {
	private lightbox: HTMLDivElement;
	private box: HTMLDivElement;
	private status: HTMLHeadElement;
	private stats: HTMLParagraphElement;

	constructor() {
		this.status = document.createElement('h1');
		this.status.textContent = "Game Ended";

		this.stats = document.createElement('p');
		this.stats.textContent = "Stats";

		this.box = document.createElement('div');
		this.box.id = 'box';

		this.lightbox = document.createElement('div');
		this.lightbox.id = 'lightbox';
		this.lightbox.addEventListener('click', (event) => {
			if (event.target !== event.currentTarget)
				return ;
			this.setLightboxActive(false);
		});

		this.box.append(this.status);
		this.box.append(this.stats);
		this.lightbox.append(this.box);
		document.body.append(this.lightbox);
	}

	public setLightboxActive(active: boolean) {
		if (active === true) {
			this.lightbox.classList.add('active');
			this.box.classList.add('active');
		}
		else if (active == false) {
			this.lightbox.classList.remove('active');
			this.box.classList.add('active');
		}
	}

	public setGameStats(stats: GameEndStatsTransmit, player: Player) {
		if (player.getPlayerId() === stats.winnerPlayerId) {
			this.status.textContent = "Victory"
		}
		else {
			this.status.textContent = "Defeat"
		}
		this.stats.textContent = JSON.stringify(stats);
	}
}