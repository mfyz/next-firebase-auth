import admin from 'firebase-admin'

if (!admin.apps.length) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert(
				process.env.FIREBASE_PRIVATE_KEY
					? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
					: undefined
			),
			databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
		})
	} catch (error) {
		console.log('Firebase admin initialization error', error.stack)
	}
}
export default admin.firestore()