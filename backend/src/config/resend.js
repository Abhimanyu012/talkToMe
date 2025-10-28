import { Resend } from 'resend';
import 'dotenv/config';

if (!process.env.RESEND_API_KEY) {
	throw new Error('Abort: You need to define RESEND_API_KEY in the .env file.');
}

export const resendClient = new Resend(process.env.RESEND_API_KEY);

/**
 * Helper to send an email using Resend
 * @param {Object} options - { from, to, subject, html }
 * @returns {Promise<any>} - API response from Resend
 */
export async function sendResendEmail(options) {
	return resendClient.emails.send(options);
}