export type UserData = 
{
	uuid:		string,
	lastOnline:	Date
};

export interface UserStore
{
	setUser(user: UserData):	Promise<void>;
	getUser(uuid: string):		Promise<UserData | null>;
}