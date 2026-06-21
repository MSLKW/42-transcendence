import { Request, Response } from "express";
import { UserStore } from "../store/userStore";
import { hashPassword } from "../auth/hash";
import { validateEmail, validatePassword } from "../auth/validation";

export function signupHandler(userStore: UserStore) {
	return async (req: Request, res: Response) => {
		const { email, password } = req.body ?? {};

		if (typeof email !== "string" || typeof password !== "string") {
			return res.status(400).json({ error: "Email and password are required." });
		}

		if (!validateEmail(email)) {
			return res.status(400).json({ error: "Invalid email format." });
		}

		const passwordCheck = validatePassword(password);
		if (!passwordCheck.valid) {
			return res.status(400).json({ error: passwordCheck.reason });
		}

		try {
			const passwordHash = await hashPassword(password);
			const user = await userStore.createUser(email, passwordHash);

			return res.status(201).json({
				id: user.id,
				email: user.email,
			});
		} catch (err: any) {
			if (err.message === "DUPLICATE_EMAIL") {
				return res.status(409).json({ error: "An account with this email already exists." });
			}

			console.error("Signup error:", err);
			return res.status(500).json({ error: "Something went wrong. Please try again." });
		}
	};
}
