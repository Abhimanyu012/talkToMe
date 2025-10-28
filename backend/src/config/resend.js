import { Resend } from 'resend'
import 'dotenv/config'

// Simple resend helper. If RESEND_API_KEY is set we create the client once.
export const resendEnabled = Boolean(process.env.RESEND_API_KEY)
const resendClient = resendEnabled ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendResendEmail(options) {
	if (!resendClient) {
		throw new Error('RESEND_API_KEY not set')
	}
	return resendClient.emails.send(options)
}

export { resendClient }