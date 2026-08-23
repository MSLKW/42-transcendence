--  ALTER TABLE <tablename>
 	-- -> Adding CONSTRAINTS


ALTER TABLE friendships
	ADD CONSTRAINT unique_pairings UNIQUE (friend_small_id, friend_big_id),
	ADD CONSTRAINT check_friends_order CHECK (friend_small_id < friend_big_id);