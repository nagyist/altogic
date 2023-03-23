import { json } from '@sveltejs/kit';
import altogic from '../../../libs/altogic.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	const { email, password, name } = await request.json();
	const { errors, session, user } = await altogic.auth.signUpWithEmail(email, password, name);

	if (errors) {
		return json({ errors });
	}

	if (session) {
		cookies.set('session_token', session.token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'Strict',
			maxAge: 60 * 60 * 24 * 30
		});
		altogic.auth.setSession(session);
		return json({
			session,
			user
		});
	}

	return json({
		user
	});
}
