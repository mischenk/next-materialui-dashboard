import { render } from "@lib/services/Templates.js";

const loadEnv = (data) => {
	data.env = process.env;
};

/**
 * The API entry point (POST) to render a given template
 * Pass the data into the JSON body
 */
export default async (req, resp) => {
	try {
		const { name } = req.query; // Name of the template file to use
		const data = req.body;

		loadEnv(data);

		const content = await render(name, data);

		resp.json({
			success: true,
			content
		});
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
