import React from 'react'
import Link from 'next/link'
import {
	useAuthUser,
	withAuthUser
} from 'next-firebase-auth'

import initAuth from '../utils/initAuth'
import '../styles/globals.scss'

initAuth()

function MyApp({ Component, pageProps }) {
	const authUser = useAuthUser()
	// console.log('--> authUser', authUser)
	const { id, email, phoneNumber, signOut } = authUser

	return (
		<div className="site-container">
			<nav>
				<div className="user-area">
					{id ? (
						<>
							<span>
								Signed in as&nbsp;
									{email ? email : ''}
									{!email && phoneNumber ? phoneNumber : ''}
							</span>
							&nbsp; &bull; &nbsp;
							<a
								onClick={() => {
									signOut()
								}}
							>
								Sign out
							</a>
						</>
					) : (
						<>
							<span>You are not signed in.</span>
							&nbsp; &bull; &nbsp;
							<Link href="/auth">
								<a>Sign in</a>
							</Link>
						</>
					)}
				</div>
				<div className="links">
					<Link href="/">
						<a>Home</a>
					</Link>
					<Link href="/user-ssr">
						<a>User Page (Server)</a>
					</Link>
					<Link href="/user-static">
						<a>User Page (Static)</a>
					</Link>
					<Link href="/books">
						<a>Books (Firestore)</a>
					</Link>
				</div>
			</nav>
			<main>
				<Component {...pageProps} />
			</main>
		</div>
	)
}

export default withAuthUser()(MyApp)

