import { fetchValidate } from "./fetchValidate";

export const handleValidate = async () => {
	try {
		await fetchValidate();
	} catch(err) {
		console.log(err);
	}
};