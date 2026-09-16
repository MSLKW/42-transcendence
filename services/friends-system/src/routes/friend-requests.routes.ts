import { Router } from "express";
import { sendFriendRequest } from "../handlers/friend-requests/sendFriendRequest";
import { acceptFriendRequest } from "../handlers/friend-requests/acceptFriendRequest";
import { rejectFriendRequest } from "../handlers/friend-requests/rejectFriendRequest";
import { listReceivedRequests } from "../handlers/friend-requests/listReceivedRequests";
import { listSentRequests } from "../handlers/friend-requests/listSentRequests";

export const friendRequestsRouter = Router();

friendRequestsRouter.post("/friend-requests", sendFriendRequest);			 // both sender & receiver in the request body
friendRequestsRouter.get("/friend-requests/received/:receiverUuid", listReceivedRequests); // ?uuid=<uuidArray> (its query as it can be empty)
friendRequestsRouter.get("/friend-requests/sent/:senderUuid", listSentRequests); 		 // ?uuid=<uuidArray> (its query as it can be empty)
friendRequestsRouter.post("/friend-requests/:requestId/accept", acceptFriendRequest); 
friendRequestsRouter.post("/friend-requests/:requestId/reject", rejectFriendRequest);

// putting uuids in sendFriendRequest? no, it dosent exists yet in friends-system's friends-requests table
// POST /friend-requests/:id/accept   → :id addresses an EXISTING request row
// POST /friend-requests               → nothing exists yet — pure creation, data goes in body
// REST convention (and most frameworks/tooling) 
// expects a POST body to carry the payload for what's being created.