import "./App.css";
import { useEffect, useState } from "react";
import QuoteCard from "./components/QuoteCard";

function App() {
	const [quotes, setQuotes] = useState([]);
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [filter, setFilter] = useState("all");

	//fetcing quotes when page loads
	useEffect(() => {
		fetchQuotes(filter);
	}, [filter]);

	//backend get request
	const fetchQuotes = async (age = filter) => {
		try {
			const response = await fetch(
				`http://127.0.0.1:8000/quotes?max_age=${age}`
			);
			const data = await response.json();
			setQuotes(data);
		} catch (err) {
			console.error("Failed to fetch quotes:", err);
		}
	};

	//no refresh handlesubmit
	const handleSubmit = async (e) => {
		e.preventDefault();  // stop page refresh
	
		try {
			const response = await fetch("http://127.0.0.1:8000/quote", {
				method: "POST",
				body: new URLSearchParams({
					name,
					message
				})
			});
	
			const newQuote = await response.json();
	
			// Add new quote to UI immediately
			setQuotes((prev) => [...prev, newQuote]);
	
			
			setName("");
			setMessage("");
	
		} catch (err) {
			console.error("Failed to submit quote:", err);
		}
	};

	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<img 
				src="/Logo.png" 
				alt="Hack at UCI logo" 
				className="logo"
			/>
			<h1>Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form onSubmit={handleSubmit}>
			<label htmlFor="input-name">Name</label>
			<input
				type="text"
				name="name"
				id="input-name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
			/>

			<label htmlFor="input-message">Quote</label>
			<input
				type="text"
				name="message"
				id="input-message"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				required
			/>

				<button type="submit">Submit</button>
			</form>

			<h2>Previous Quotes</h2>
			<label>Show quotes from:</label>
			<select
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				style={{ marginLeft: "10px", marginBottom: "20px" }}
			>
				<option value="all">All time</option>
				<option value="week">Last week</option>
				<option value="month">Last month</option>
				<option value="year">Last year</option>
			</select>
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
