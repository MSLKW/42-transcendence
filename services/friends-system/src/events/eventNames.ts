// Single source of truth for every SSE event name this service sends.
// test.html's addEventListener(...) calls must match these strings exactly.
export const EVENTS = {
  CONNECTED: "connected",
  REPLACED: "replaced",
  FRIEND_REQUEST_RECEIVED: "friend_request_received",
  FRIEND_REQUEST_ACCEPTED: "friend_request_accepted",
  FRIEND_REQUEST_REJECTED: "friend_request_rejected",
  FRIENDS_LIST_UPDATED: "friends_list_updated",
} as const;
