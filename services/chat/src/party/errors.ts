//creates a validation error for invalid requests or party payload
export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ValidationError";
	}
}

//creates a not-found error for requests for a party that does not exist
export class PartyNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PartyNotFoundError";
	}
}

//creates a conflict error for conflicts with the current party state
export class PartyConflictError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PartyConflictError";
	}
}
