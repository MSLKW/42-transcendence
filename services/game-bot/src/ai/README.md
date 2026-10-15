Own cards				52 bools
Opponent1 cards			52 bools
Opponent2 cards			52 bools
Opponent3 cards			52 bools
Unknown cards			52 bools

Own card count			1 float (0.0 - 1.0)
Opponent1 card count	1 float (0.0 - 1.0)
Opponent2 card count	1 float (0.0 - 1.0)
Opponent3 card count	1 float (0.0 - 1.0)

Top card hand			23 numbers (Card Hand)

Last 20 Moves			460 numbers (20 Card Hands)
Turn number				1 ints

Follow or Lead			2 bools (0: follow, 1: lead)
Current Leader			4 bools (0 - 4)

Total					519 numbers			



[Card Hand]
Player	4 bools (who is the player)
Type	9 bools (Skip, Single, Double, Triple, Straight, Flush, Full House, Four of a Kind, Straight Flush)
Card1	2 ints ([0-13, 0-4]: [rank, suit] 0,0 for no card)
Card2	2 ints ([0-13, 0-4]: [rank, suit] 0,0 for no card)
Card3	2 ints ([0-13, 0-4]: [rank, suit] 0,0 for no card)
Card4	2 ints ([0-13, 0-4]: [rank, suit] 0,0 for no card)
Card5	2 ints ([0-13, 0-4]: [rank, suit] 0,0 for no card)
Total:	23 numbers
