import { verifyIdToken } from 'next-firebase-auth'
import initAuth from '../../../utils/initAuth'
import db from '../../../utils/initFirestore'

initAuth()

export default async (req, res) => {
	if (!(req.headers && req.headers.authorization)) {
		return res.status(400).json({ error: 'Missing Authorization header value' })
	}
	const token = req.headers.authorization
	try {
		await verifyIdToken(token)
	} catch (e) {
		console.error(e)
		return res.status(403).json({ error: 'Not authorized' })
	}
	
	const { id } = await db.collection('books').add({
		...req.body,
		created: new Date().toISOString(),
	})

	return res.status(200).json({ id })
}
