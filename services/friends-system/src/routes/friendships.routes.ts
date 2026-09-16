import { Router } from "express";
import { listFriends } from "../handlers/friendships/listFriends";
import { removeFriend } from "../handlers/friendships/removeFriend";

export const friendshipsRouter = Router();

friendshipsRouter.get("/friendships/:ownerUuid", listFriends);
friendshipsRouter.delete("/friendships/:ownerUuid/:friendUuid", removeFriend);
