import assert from "node:assert/strict";
import test from "node:test";
import { checkNameValidity } from "../src/utilities/react/checkNameValidity";

test("accepts trimmed usernames with supported characters and lengths", () => {
	assert.equal(checkNameValidity(" Ace_42 "), true);
	assert.equal(checkNameValidity("a-b"), true);
	assert.equal(checkNameValidity("x".repeat(20)), true);
});

test("rejects names outside the username rules", () => {
	for (const name of ["", "ab", "x".repeat(21), "two words", "name!", "éclair"])
		assert.equal(checkNameValidity(name), false, `unexpectedly accepted ${name}`);
});
