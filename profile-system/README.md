# Profile System

## Endpoints

| Method | Path | Purpose |
|:---:|---|---|
| GET | `/profile/:uuid`	| get a user's profile information |
| GET | `/settings/:uuid`	| get a user's settings configuration |
| GET | `/search/:query`	| get a list of uuids of users whose username matches a search query |
| PUT | `/profile`			| sets the calling user's modifiable profile information (username, badge, avatar path) |
| PUT | `/settings`			| sets the calling user's settings configuration |
| PUT | `/avatar`			| uploads an image as `$(AVATAR_DIR)/<uuid>.png`  |