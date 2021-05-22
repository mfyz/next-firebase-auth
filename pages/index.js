import React from 'react'
import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
} from 'next-firebase-auth'

const Demo = () => {
	const AuthUser = useAuthUser()
	return (
		<div style={{ marginBottom: 32 }}>
			<h3>Home</h3>
			<p>
				This page does not require authentication, so it won't redirect to
				the login page if you are not signed in.
			</p>
			<p>
				If you remove `getServerSideProps` from this page, it will be static
				and load the authed user only on the client side.
			</p>
		</div>
	)
}

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser()(Demo)
