import { Router } from "express";
import { listFriends } from "../handlers/friends/listFriends";
import { removeFriend } from "../handlers/friends/removeFriend";

export const friendsRouter = Router();

friendsRouter.get("/friends", listFriends);
friendsRouter.delete("/friends/:friendUuid", removeFriend);
