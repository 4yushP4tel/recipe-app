import {React, useState} from "react"
import food_image from '../images/food.png'
import { Link } from "react-router-dom";


export function Header(){
    return(
    <header className="navbar">
        <div className="left_nav">
        <img src={food_image} alt="food_icon" />
        <h1 className="logo"> What's 4 Diner</h1>
        </div>

        <nav className= "nav-links">
            <Link to={"/homesignedin"}>
                <button>Home</button>
            </Link>
            <Link to={"/recipes"}>
                <button>Find Recipes</button>
            </Link>
            <Link to={"/pantry"}>
                <button>Pantry</button>
            </Link>
            <Link to={"/chefai"}>
                <button>ChefAI</button>
            </Link>
        </nav>
    </header>

    );
}