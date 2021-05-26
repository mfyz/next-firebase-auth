import React, { useEffect, useState } from 'react'
import { withAuthUser, AuthAction } from 'next-firebase-auth'
import cookieParser from 'cookie'
import firebase from 'firebase/app'
import 'firebase/auth'

const AuthEmailLink = ({ emailForSignIn }) => {
	const [error, setError] = useState(null)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
				let email = window.localStorage.getItem('firebaseEmailForSignIn')
				if (!email) {
					setError('Can not resolve email address you tried to sign-in. Use same device you used to sign-in.')
					return
				}
				firebase.auth().signInWithEmailLink(email, window.location.href)
					.then((result) => {
						window.localStorage.removeItem('firebaseEmailForSignIn')
						window.location.href = '/' // Or redirect url...
					})
					.catch((error) => {
						// console.log('--> error', error)
						setError(error.message)
					});
			}
		}
	}, [])

	if (error) return <p><b>Sign-in Error:</b> {error}</p>

	return <p style={{ textAlign: 'center' }}>Loading...</p>
}

export default withAuthUser({
	whenAuthed: AuthAction.RENDER,
	whenUnauthedBeforeInit: AuthAction.NULL,
	whenUnauthedAfterInit: AuthAction.RENDER,
})(AuthEmailLink)
