import { React, useState } from "react"
import food_image from '../images/food.png'
import { Link } from "react-router-dom";
import { Logout } from './logout';


export function Header({ setStatus }) {
    return (
        <header className="navbar">
            <div className="left_nav">
                <img src={food_image} alt="food_icon" />
                <Link to={"/homesignedin"} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h1 className="logo"
                        style={{
                            transition: 'transform 0.3s ease-in-out',
                            transform:'scale(1.1)',
                        }}
                    > What's 4 Dinner</h1>
                </Link>
            </div>

            <nav className="nav-links">
                <Link to={"/recipes"}>
                    <button>Find Recipes</button>
                </Link>
                <Link to={"/pantry"}>
                    <button>Pantry</button>
                </Link>
                <Link to={"/chefai"}>
                    <button>ChefAI</button>
                </Link>
                <Logout setStatus={setStatus} />
            </nav>
        </header>

    );
}