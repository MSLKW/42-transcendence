import { CardTransmit } from "@bigtwo/shared"

export class CardDeckState {
	private cards: Array<CardTransmit>;
	public size: number;
	
	constructor() {
		this.cards = [];
		this.initCards();
		this.shuffleCards();
		this.size = 52;
	}

	private initCards() {
		for (let suit = 0; suit < 4; suit++) {
			for (let rank = 0; rank < 13; rank++) {
				let card: CardTransmit = {
					rank: rank,
					suit: suit,
				}
				this.cards.push(card);
			}
		}
	}

	private shuffleCards() {
		for (let i = this.cards.length - 1; i > 0; i--) {
			const randomIndex = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[randomIndex]] = [this.cards[randomIndex], this.cards[i]];
		}
	}

	public dealCards(amount: number): Array<CardTransmit> {
		let dealCards: Array<CardTransmit> = [];
		let i = 0;
		while (i < amount && i < this.cards.length) {
			dealCards.push(this.cards[i]);
			i++;
		}
		this.cards.splice(0, i);
		return (dealCards);
	}

	public reset() {
		this.cards.length = 0;
		this.initCards();
		this.shuffleCards();
	}
}