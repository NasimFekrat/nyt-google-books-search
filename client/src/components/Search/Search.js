import React from "react";
import "./Search.css";
import PropTypes from 'prop-types';

const Search = ({ type, query, queryObject }) => {

    let _type, _query;

    const submit = (e) => {
        e.preventDefault();
        queryObject({
            type: _type.value,
            query: _query.value
        });
    };

    const categoryChange = () => {
    }

    return (
        <nav className="search" aria-label="Book search form" id="book-form">
            <form onSubmit={submit}>
                <select className="dropDown" aria-label="Drop-down list for book search category"
                    defaultValue={type}
                    ref={option => _type = option}>
                    <option onClick={() => categoryChange()} value="q=intitle:">Title</option>
                    <option onClick={() => categoryChange()} value="q=inauthor:">Author</option>
                    <option onClick={() => categoryChange()} value="q=subject:">Subject</option>
                </select>
                <input className="searchText" aria-label="Book search box"
                    type="text"
                    defaultValue={query}
                    ref={input => _query = input}
                    placeholder="Enter search terms"
                    autoFocus />
                <input className="searchButton" type="submit"
                    value="Search" />
            </form>
        </nav>
    )
}

Search.propTypes = {
    type: PropTypes.string,
    query: PropTypes.string
};


export default Search;
