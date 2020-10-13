// Imports
import { Router, createHash } from "./deps.ts";
import { uniqueVisit, visit } from "./api.ts";

// Export the router.
export const router = new Router();
export default router;

// Router endpoints.

router.get("/v/:key([a-z0-9]{1,64})", async (req, res) => {
	try
	{
		const num = await visit(req.params.key);
		await res.json(num);
	} catch (error)
	{
		await res.status(500).end();
	}
});

router.get("/u/:key([a-z0-9]{1,64})", async (req, res) => {
	try
	{
		const hash = new Uint8Array(createHash("sha1").update(req.ip).digest())
			.reduce((str, c) => str += c.toString(16).padStart(2, "0"), "");
		const num = await uniqueVisit(req.params.key, hash);
		await res.json(num);
	} catch (error)
	{
		await res.status(500).end();
		console.error(error);
	}
});
