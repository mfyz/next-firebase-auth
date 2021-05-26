import React, { useEffect, useState } from 'react'
import { withAuthUser, AuthAction } from 'next-firebase-auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import cookieParser from 'cookie'
import 'firebase/auth'

import getAbsoluteURL from '../utils/getAbsoluteURL'

// Note, if you will not use any other sign-in method than email-link method, you can clean up firebase-ui
// package, component and the configuration below in this page.

const firebaseAuthConfig = {
	signInFlow: 'popup',
	signInOptions: [
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		firebase.auth.PhoneAuthProvider.PROVIDER_ID,
	],
	signInSuccessUrl: '/',
	credentialHelper: 'none',
	callbacks: {
		signInSuccessWithAuthResult: () => false,
	},
}

const FirebaseAuth = () => {
	const [email, setEmail] = useState('')
	const [isEmailSent, setEmailSent] = useState(false)
	const [renderAuth, setRenderAuth] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setRenderAuth(true)
		}
	}, [])

	const sendEmailLink = () => {
		firebase.auth().sendSignInLinkToEmail(email, {
			url: getAbsoluteURL('/auth-email'),
			handleCodeInApp: true
		})
			.then(() => {
				window.localStorage.setItem('firebaseEmailForSignIn', email)
				setEmailSent(true)
			})
			.catch((error) => {
				console.log('--> Email link sending failed: ', error.message)
				alert('Email sending failed!')
			});
	}

	return (
		<div>
			{isEmailSent && (
				<h3 style={{ marginBottom: 40, textAlign: 'center' }}>
					Email sent with sign-in link.
				</h3>
			)}
			<div>
				{renderAuth && !isEmailSent ? (
					<div>
						<div className="signInViaEmailForm">
							<p>Sign-in with Email Link</p>
							<input
								type="email"
								value={email}
								placeholder="Email address"
								onChange={e => setEmail(e.target.value)}
							/>
							<button onClick={sendEmailLink}>Sign-in via Email Link</button>
							<p className="or">&mdash; &nbsp; or &nbsp; &mdash;</p>
						</div>
						<StyledFirebaseAuth
							uiConfig={firebaseAuthConfig}
							firebaseAuth={firebase.auth()}
						/>
					</div>
				) : null}
			</div>
		</div>
	)
}

export const getServerSideProps = async ({ req: { headers: { cookie }}}) => {
	const cookies = cookieParser.parse(cookie)
	return {
		props: {
			emailForSignIn: cookies['emailForSignIn'] ? cookies.emailForSignIn : null
		}
	}
}

export default withAuthUser({
	whenAuthed: AuthAction.REDIRECT_TO_APP,
	whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
	whenUnauthedAfterInit: AuthAction.RENDER,
})(FirebaseAuth)