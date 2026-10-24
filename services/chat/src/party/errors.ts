//represents an invalid request or party payload
export class ValidationError extends Error {
	//creates a validation error with a readable message
	constructor(message: string) {
		super(message);
		this.name = "ValidationError";
	}
}

//represents a request for a party that does not exist
export class PartyNotFoundError extends Error {
	//creates a not-found error with a readable message
	constructor(message: string) {
		super(message);
		this.name = "PartyNotFoundError";
	}
}

//represents a conflict with the current party state
export class PartyConflictError extends Error {
	//creates a conflict error with a readable message
	constructor(message: string) {
		super(message);
		this.name = "PartyConflictError";
	}
}
