// Real UUID is formed in this exact shape => 8-4-4-4-12 hex characters.
// Database layer: Malformed uuid (typos, truncation, extra characters) is catched BEFORE it ever reaches Postgres 
// Application layer: will crashes any query too via isValidUuid check 
// Malformed uuid throws SQLSTATE 22P02 by Postgres itself
// not the same as a real FK violation.

// regex (regular expression)
// meaning: a pattern used to check if a string looks a certain way, character by character.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// this fn runs a regex against a string in JavaScript
// .test() returns true if the string matches the pattern
export function isValidUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}