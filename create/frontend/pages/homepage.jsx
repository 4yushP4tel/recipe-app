import React, { useState } from 'react';
import food_image from '../images/food.png'
import { Link } from 'react-router-dom';
import { AutoCarousel } from '../components/autoCarousel';
import { Slideshow } from '../components/slideshow';

export function HomepageSignedOut() {
    return (
        <div className='signedout_container'>
            <div className='header-container'>
                <img src={food_image} alt="food_icon" />
                <h1>What's 4 Dinner</h1>
            </div>
            <AutoCarousel />
            <div className='bottom-content'>
                <div className='text-left'>
                    <h2>Welcome to What's 4 Dinner</h2>
                    <p>Find custom recipes that you can cook with whatever you have at home!</p>
                </div>
                <Link to="/signup">
                    <button>Get Started Today</button>
                </Link>
            </div>
        </div>
    );
}

export function HomepageSignedIn() {
    return (
        <div className='signedin_container'>
            <h2>Welcome to What's 4 Dinner</h2>
            <p>Find custom recipes that you can cook with whatever you
                have at home!
            </p>
            <Link to="/recipes">
                <button className="find_recipes_button">Find Recipes Today</button>
            </Link>
            <Slideshow />
        </div>
    );
}