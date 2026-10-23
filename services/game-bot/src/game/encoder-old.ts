	
	// encode(): number[]
	// {
	// 	const encodedState: number[] = [
	// 		...this.encodeCards(),
	// 		...this.encodeCardCount(),
	// 		...this.encodeCardHand(this.lastCardHand),
	// 		...this.encodeHistory(),
	// 		this.turnNumber,
	// 	];
	// 	return (encodedState)
	// }

	// private encodeCards(): number[]
	// {
	// 	const playerCardsEncoded: number[][] = [];

	// 	playerCardsEncoded[0] = this.encodePlayerCards(this.ownCards); 
	// 	let i = 1;
	// 	for (const key in this.opponentCards)
	// 	{
	// 		if (key != this.botId)
	// 			playerCardsEncoded[this.playerSeats[key]] = this.encodePlayerCards(this.opponentCards[key]);
	// 		i++;
	// 	}
	// 	while (i < 4)
	// 	{
	// 		playerCardsEncoded[i] = new Array<number>(52).fill(0);
	// 		i++;
	// 	}
		
	// 	const unseenCards = new Array<number>(52)
	// 	for (let i = 0; i < 52; i++)
	// 	{
	// 		unseenCards[i] =
	// 			this.originalCardsEncoded[i]
	// 			|| playerCardsEncoded[1][i]
	// 			|| playerCardsEncoded[2][i]
	// 			|| playerCardsEncoded[3][i]
	// 			? 0 : 1;
	// 	}

	// 	const encodedCards: number[] = [
	// 		...playerCardsEncoded[0],
	// 		...playerCardsEncoded[1],
	// 		...playerCardsEncoded[2],
	// 		...playerCardsEncoded[3],
	// 		...unseenCards
	// 	];
	// 	return (encodedCards);
	// }

	// private encodeCardCount(): number[]
	// {
	// 	const encodedCardCount = new Array<number>(4).fill(0);

	// 	encodedCardCount[0] = this.ownCards.length / 52;
	// 	for (const key in this.opponentCards)
	// 			encodedCardCount[this.playerSeats[key]] = (Math.floor(52 / this.playerCount) - this.opponentCards[key].length) / 52;
	// 	return (encodedCardCount);
	// }

	// private encodeHistory(): number[]
	// {
	// 	const encodedHistory: number[] = [];

	// 	for (let i = this.moveHistory.length - 1; i >= 0; i--)
	// 		encodedHistory.push(...this.encodeCardHand(this.moveHistory[i]))
	// 	encodedHistory.push(...Array<number>((20 * 23) - encodedHistory.length).fill(0));
	// 	return (encodedHistory);
	// }

	// private encodePlayerCards(cards: Card[]): number[]
	// {
	// 	const encodedCards = new Array<number>(52).fill(0);

	// 	for (const card of cards)
	// 	{
	// 		const i = card.suit * 13 + card.rank;
	// 		encodedCards[i] = 1;
	// 	}
	// 	return (encodedCards);
	// }

	// private encodeCardHand(cardHand: CardHand): number[]
	// {
	// 	const player = new Array<number>(4).fill(0);
	// 	const handType = new Array<number>(9).fill(0);
	// 	const cards = new Array<number>(10).fill(0);

	// 	if (cardHand.playerId == "")
	// 		return [...player, ...handType, ...cards];
	// 	player[this.playerSeats[cardHand.playerId]] = 1;
	// 	let handTypeIndex = cardHand.handType;
	// 	if (cardHand.handType == HandType.Pentuple)
	// 		handTypeIndex += cardHand.pentupleType - 1;
	// 	handType[handTypeIndex] = 1;
	// 	for (let i = 0; i < cardHand.cards.length; i++)
	// 	{
	// 		cards[(2 * i)] = (cardHand.cards[i].rank + 1) / 13;
	// 		cards[(2 * i) + 1] = (cardHand.cards[i].suit + 1) / 4;
	// 	}
	// 	return [...player, ...handType, ...cards];
	// }