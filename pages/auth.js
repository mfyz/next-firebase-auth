import React from 'react'
import { withAuthUser, AuthAction } from 'next-firebase-auth'
import FirebaseAuth from '../components/FirebaseAuth'

const Auth = () => (
	<div>
		<p style={{ marginBottom: 40, textAlign: 'center' }}>
			This auth page is <b>static</b>. It will redirect on the client side if
			the user is already authenticated.
		</p>
		<div>
			<FirebaseAuth />
		</div>
	</div>
)

export default withAuthUser({
	whenAuthed: AuthAction.REDIRECT_TO_APP,
	whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
	whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth)