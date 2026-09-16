import { Router } from "express";
import { listFriends } from "../handlers/friendships/listFriends";
import { removeFriend } from "../handlers/friendships/removeFriend";

export const friendshipsRouter = Router();

friendshipsRouter.get("/friends", listFriends);
friendshipsRouter.delete("/friends/:friendUuid", removeFriend);
