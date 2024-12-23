import {React, useState} from "react"

export function Header({ goToPage }){
    return(
    <>
        <h2>What's 4 Diner</h2>
        <nav>
            <button onClick={() => goToPage('homesignedin')}>Home</button>
            <button onClick={() => goToPage('recipes')}>Find Recipes</button>
            <button onClick={() => goToPage('pantry')}>Pantry</button>
            <button onClick={() => goToPage('chefai')}>ChefAI</button>
        </nav>
    </>

    );
}