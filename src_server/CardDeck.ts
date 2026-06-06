import { CardTransmit } from "../src_shared/Types.js"

export class CardDeck {
	private cards: Array<CardTransmit>;
	
	constructor() {
		this.cards = [];
		this.initCards();
		this.shuffleCards();
	}

	private initCards() {
		for (let suite = 0; suite < 4; suite++) {
			for (let rank = 0; rank < 13; rank++) {
				let card: CardTransmit = {
					rank: rank,
					suite: suite,
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
}