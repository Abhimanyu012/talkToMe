import { Resend } from 'resend';
import 'dotenv/config';

// Lazy initialize the Resend client so importing this module won't crash the app
// if RESEND_API_KEY is not configured in some environments (e.g. optional email feature).
let _resendClient = null;

function initClient() {
	if (_resendClient) return _resendClient;
	const key = process.env.RESEND_API_KEY;
	if (!key) return null;
	_resendClient = new Resend(key);
	return _resendClient;
}

export function getResendClient() {
	const client = initClient();
	if (!client) {
		throw new Error('RESEND_API_KEY is not configured. Set RESEND_API_KEY in the environment to enable email sending.');
	}
	return client;
}

/**
 * Send an email using Resend. Throws if RESEND_API_KEY is not set.
 * @param {Object} options - { from, to, subject, html }
 */
export async function sendResendEmail(options) {
	const client = getResendClient();
	return client.emails.send(options);
}

// Export a safe boolean so other modules can check if email sending is available
export const resendEnabled = Boolean(process.env.RESEND_API_KEY);