import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../css/Navbar.css";

function Navbar() {

	return (
		<header>
			<h3>Calorie Tracker</h3>
			<nav>
				<a href="">Edit</a>
				<a href="" className="delete-btn">Delete</a>
			</nav>
		</header>
	);
}

export default Navbar;