import {React, useState} from "react"
import food_image from '../images/food.png'


export function Header({ goToPage }){
    return(
    <header className="navbar">
        <div className="left_nav">
        <img src={food_image} alt="food_icon" />
        <h1 className="logo"> What's 4 Diner</h1>
        </div>

        <nav className= "nav-links">
            <button onClick={() => goToPage('homesignedin')}>Home</button>
            <button onClick={() => goToPage('recipes')}>Find Recipes</button>
            <button onClick={() => goToPage('pantry')}>Pantry</button>
            <button onClick={() => goToPage('chefai')}>ChefAI</button>
        </nav>
    </header>

    );
}