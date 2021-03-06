import nodemailer from "nodemailer";
import ApiError from "../ApiError.js";
import { loadEnv } from "../utils/Env.js";

let transporter = null;

/**
 * @typedef Mail
 * @property {Function} sendMail
 */

/**
 * @return {Mail}
 */
const getTransporter = () => {
	if (typeof window === "undefined" && !transporter) {
		if (process.env.NODE_ENV === "test") {
			// Help us for the test
			console.log("Loading the environment variables");
			loadEnv();
		}

		const {
			SMTP_HOST,
			SMTP_PORT,
			SMTP_SECURE,
			SMTP_USER,
			SMTP_USERNAME,
			SMTP_PWD
		} = process.env;

		if (!SMTP_HOST || !SMTP_USER || !SMTP_USERNAME || !SMTP_PWD) {
			throw new ApiError(
				400,
				"Missing SMTP Transport environment variables (SMTP_HOST..)."
			);
		}

		const from = `${SMTP_USERNAME} <${SMTP_USER}>`;

		transporter = nodemailer.createTransport(
			{
				host: SMTP_HOST,
				port: SMTP_PORT,
				secure: SMTP_SECURE === "true", // use TLS
				auth: {
					user: SMTP_USER,
					pass: SMTP_PWD
				}
			},
			{
				from,
				replyTo: from
			}
		);
	}

	return transporter;
};

/**
 * @typedef MailMessage
 * @property {String!} subject
 * @property {String} text
 * @property {String} html
 * @property {String|Array} to Main recipient
 * @property {String|Array} cc
 * @property {String|Array} bcc
 */

/**
 * Send an email using the SMTP transport defined by the current environment variables
 * The MailMessage object format is the one defined by nodemailer API
 * @see https://nodemailer.com/message
 * @see https://nodemailer.com/message/addresses/
 * @param {MailMessage} message
 */
const sendMail = async (message) => {
	// Check required parameters
	const { subject, text, to, attachments } = message;

	if (!subject || !text || !to) {
		throw new ApiError(400, "Missing parameter 'subject', 'text' or 'to'");
	}

	if (typeof to === "object") {
		const { name, address } = to;
		if (!address) {
			throw new ApiError(400, "Missing parameter 'to.address'");
		}
	}

	if (Array.isArray(attachments)) {
		// Check if the attachments are in base64
		message.attachments = attachments.map(({ filename, content, format }) => {
			if (typeof content === "string" && format === "base64") {
				console.log(`Disencoding base64 attachment for ${filename}`);
				return {
					filename,
					content: Buffer.from(content, "base64")
				};
			} else {
				return {
					filename,
					content
				};
			}
		});
	}

	try {
		const transporter = getTransporter();
		console.log(`Sending the mail ${subject}.`);
		message.attachments &&
			console.log(
				`Attachments : ${message.attachments.map(
					({ content, filename }) => filename + " (" + content.length + "bytes)"
				)}`
			);
		const resp = await transporter.sendMail(message);
		return resp;
	} catch (err) {
		console.error(`Mail not sent`, err);
		throw new ApiError(500, `Mail ${subject} not send. ${err.message}`);
	}
};

const Mailer = { sendMail };
export default Mailer;
