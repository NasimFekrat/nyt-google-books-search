import React from "react";
import "./Menu.css";
import { FaHome } from 'react-icons/fa/';
import { MdStar } from 'react-icons/md/';

const Menu = ({ setVisibility, visibility }) => {

    const color = { color: '#BDBDBD'};

	const showBooks = () => {
		console.log(visibility);
		setVisibility({
				highlight: false,
				booklist: false,
				books: true
			
		});
		
	}

	const showHome = () => {
		setVisibility({
			highlight: false,
			booklist: true,
			books: false
		});

	}

	return (
		<nav aria-label="App navigation" id="app-nav">
			<span>{visibility.books ? 
				<MdStar style={color} /> : 
				<MdStar onClick={() => showBooks()}/>}</span>
			<span>{visibility.books ?
				<FaHome onClick={() => showHome()}/> :
			    <FaHome style={color} /> }</span>
		</nav>
	)
}


export default Menu;
