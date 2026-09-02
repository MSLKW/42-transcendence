import { Router } from "express";
import { sendFriendRequest } from "../handlers/friend-requests/sendFriendRequest";
import { acceptFriendRequest } from "../handlers/friend-requests/acceptFriendRequest";
import { rejectFriendRequest } from "../handlers/friend-requests/rejectFriendRequest";
import { listReceivedRequests } from "../handlers/friend-requests/listReceivedRequests";
import { listSentRequests } from "../handlers/friend-requests/listSentRequests";

export const friendRequestsRouter = Router();

friendRequestsRouter.post("/friend-requests", sendFriendRequest);
friendRequestsRouter.get("/friend-requests/received", listReceivedRequests);
friendRequestsRouter.get("/friend-requests/sent", listSentRequests);
friendRequestsRouter.post("/friend-requests/:id/accept", acceptFriendRequest);
friendRequestsRouter.post("/friend-requests/:id/reject", rejectFriendRequest);
