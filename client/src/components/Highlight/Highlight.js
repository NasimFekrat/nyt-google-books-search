import React from "react";
import "./Highlight.css";
import PropTypes from 'prop-types';
import { MdStarHalf } from 'react-icons/md/';
import { MdStars } from 'react-icons/md/';
import { MdStar } from 'react-icons/md/';
import { MdHighlightOff } from 'react-icons/md/';

const Highlight = ({ data, visibility, addBook, removeBook }) => {

    const color = {background: 'white', border: 'white', color: 'red'};
	
	// Transform numerical rating into 5 star UI element
	const renderStars = (rating) => {
		let stars = [];
		let i;
		if(rating) {
			for (i = 0; i < 5; i++) {
				stars.push(<MdStars key={i} />);
			}
		}
		for (i = 0; i < Math.floor(rating); i++) {
			stars.splice(i, 1, <MdStar key={i} />);
		}
		if (i < rating) {
			stars.splice(i, 1, <MdStarHalf key={i + 1} />);
		}	
			return stars;
	};

	const addToBooks = () => {
		console.log("Favouriting...");
		addBook(data);
	};

	const removeFromBooks = () => {
		removeBook(data);
	};

	if (visibility.highlight) {
		return (
			<section id="book-highlight" 
							 aria-label="Area showing information about book selected from list">
				<h2>{data.title}</h2>
				<h3>{(data.authors) ? <span>by</span> : null}{data.authors}</h3>
				<span>{renderStars(data.rating)} {data.ratingsCount ? <span>({data.ratingsCount})</span> : null}</span>
				<figure>
					<img src={data.thumbnail} alt={data.title}/>
					<figcaption>{data.description}</figcaption>
				</figure>
				<div>
					<span>{data.publisher}</span>
					<span>{data.publishedDate}</span>
				</div>
				<hr/>
				<div>
					{!visibility.books ? 
						<button onClick={() => addToBooks()}><MdStar /> Save This Book</button> : 
						<button style={color} onClick={() => removeFromBooks()}><MdHighlightOff /> Remove</button>}
					{(data.price) ? <a href={data.purchase}> Buy ${data.price}</a> : null}
				</div>
			</section>
		)
	} else {
		return null;
	}
}

Highlight.propTypes = {
	data: PropTypes.object
};


export default Highlight;
