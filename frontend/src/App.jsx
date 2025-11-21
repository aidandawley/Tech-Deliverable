import "./App.css";
import { useEffect, useState } from "react";
import QuoteCard from "./components/QuoteCard";

function App() {
	const [quotes, setQuotes] = useState([]);

	//fetcing quotes when page loads
	useEffect(() => {
		fetchQuotes();
	}, []);

	//backend get request
	const fetchQuotes = async () => {
		try {
			const response = await fetch("http://127.0.0.1:8000/quotes?max_age=all");
			const data = await response.json();
			setQuotes(data);
		} catch (err) {
			console.error("Failed to fetch quotes:", err);
		}
	};

	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<h1>Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form action="/api/quote" method="post">
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required />
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required />
				<button type="submit">Submit</button>
			</form>

			<h2>Previous Quotes</h2>
			{/* TODO: Display the actual quotes from the database */}
			<div className="messages">
				{quotes.map((q, i) => (
					<QuoteCard key={i} quote={q} />
				))}
			</div>
		</div>
	);
}

export default App;
