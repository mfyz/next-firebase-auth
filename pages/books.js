import React, { useCallback, useEffect, useState } from 'react'
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth'
import FullPageLoader from '../components/FullPageLoader'
import getAbsoluteURL from '../utils/getAbsoluteURL'

const Books = () => {
	const AuthUser = useAuthUser()
	const [books, setBooks] = useState([])
	const [bookTitle, setBookTitle] = useState('')
	const [bookAuthor, setBookAuthor] = useState('')

	const fetchBooks = async () => {
		const token = await AuthUser.getIdToken()
		const endpoint = getAbsoluteURL('/api/books')
		const response = await fetch(endpoint, {
			method: 'GET',
			headers: {
				Authorization: token,
			},
		})
		const data = await response.json()
		if (!response.ok) {
			console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`)
			return null
		}
		return data
	}

	const fetchData = useCallback(fetchBooks, [AuthUser])

	useEffect(() => {
		const fetchBooksInitially = async () => {
			const data = await fetchData()
			setBooks(data ? data.books : [])
		}
		fetchBooksInitially()
	}, [fetchData])

	const refreshBooksList = async () => {
		const refreshedBooksData = await fetchBooks()
		setBooks(refreshedBooksData ? refreshedBooksData.books : [])
	}

	const handleAddBook = async () => {
		if (!bookTitle) {
			alert('Book title is required!')
			return
		}

		const token = await AuthUser.getIdToken()
		const endpoint = getAbsoluteURL('/api/books/add')
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: bookTitle,
				author: bookAuthor
			})
		})
		const data = await response.json()
		if (!response.ok) {
			console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`)
			return
		}
		if (!data.id) {
			console.error(`Book wasn't added!`)
			return
		}
		// Celan up Add Form
		setBookTitle('')
		setBookAuthor('')
		// Refresh the books list
		refreshBooksList()
	}

	const handleDeleteBook = (bookId) => async () => {
		if (!bookId) {
			alert('Book id is required!')
			return
		}

		if (confirm('Are you sure to delete this book?')) {
			const token = await AuthUser.getIdToken()
			const endpoint = getAbsoluteURL('/api/books/delete')
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					Authorization: token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					book_id: bookId
				})
			})
			const data = await response.json()
			if (!response.ok) {
				console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`)
				return
			}
			if (!data.success) {
				console.error(`Book wasn't deleted!`)
				return
			}
			refreshBooksList()
		}
	}

	return (
		<div>
			<h3>Books</h3>
			<ul className="books-list">
				{books.map((book) => (
					<li key={book.title}>
						<b>{book.title}</b>
						{book.author ? ` (${book.author})` : ''}
						<a className="delete-book" onClick={handleDeleteBook(book.id)}>Delete</a>
					</li>
				))}
			</ul>

			<div style={{ marginTop: 50, paddingTop: 30, borderTop: '1px solid #cccccc' }}>
				<h4>Add New Book</h4>
				Title: <input type="text" value={bookTitle} onChange={e => setBookTitle(e.target.value)} /> &nbsp;
				Author: <input type="text" value={bookAuthor} onChange={e => setBookAuthor(e.target.value)} /> &nbsp;
				<input type="submit" value="Add" onClick={handleAddBook} />
			</div>
		</div>
	)
}

export default withAuthUser({
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	LoaderComponent: FullPageLoader,
})(Books)
