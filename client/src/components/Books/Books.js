import React from "react";
import "./Books.css";
import PropTypes from 'prop-types';
import BookRow from '../BookRow';

const Books = ({ data, highlight, visibility }) => {

    if (visibility) {
        return (
            <section id="books"
							 aria-label="List of books added to save in database">
				{data.map((entry, i) =>
					<BookRow key = {i}
					         rowNumber = {i}
					         title = {entry.title}
					         author = {entry.authors}
					         rating = {entry.rating}
					         highlight = {highlight}
					/>
				)}
			</section>
        )
    } else {
        return null;
    }
}

Books.propTypes = {
	data: PropTypes.array
}

export default Books;
