import argon2 from "argon2";
import { createHash } from "crypto";

const HASH_OPTIONS = {
	type: argon2.argon2id,
	memoryCost: 2 ** 16, // 65536 KiB = 64 MiB
	timeCost: 3,
	parallelism: 1,
};

export async function hashPassword(plain: string): Promise<string> {
	return argon2.hash(plain, HASH_OPTIONS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
	return argon2.verify(hash, plain);
}

export function hashToken(token: string): string {
	return createHash("sha256").update(token).digest("hex");
}
