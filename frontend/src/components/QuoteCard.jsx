import "./QuoteCard.css";

function QuoteCard({ quote }) {
	return (
		<div className="quote-card">
			<p className="quote-message">"{quote.message}"</p>
			<p className="quote-name">— {quote.name}</p>
			<p className="quote-time">{new Date(quote.time).toLocaleString()}</p>
		</div>
	);
}

export default QuoteCard;
