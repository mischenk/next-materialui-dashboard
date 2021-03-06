import { getParseInstance } from "@models/ParseSDK";

/**
 *
 */
export default async (req, resp) => {
	try {
		const data = req.body;
		const Parse = getParseInstance();
		const adherent = await Parse.Adherent.register(null, data);
		resp.json({
			success: true,
			adherent
		});
	} catch (err) {
		resp.status(err.code).json({
			success: false,
			error: err.message
		});
	}
};