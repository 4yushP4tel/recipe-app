import React, {useState } from 'react';
import food_image from '../images/food.png'
import { Wheel } from '../components/image_wheel';

export function HomepageSignedOut({goToPage}){
    return(
        <div className='signedout_container'>
            <div className='header-container'>
                <img src={food_image} alt="food_icon" />
                <h1>What's 4 Diner</h1>
            </div>
            <Wheel/>
            <div className = 'bottom-content'>
                <div className = 'text-left'>
                    <h2>Welcome to What's 4 Diner</h2>
                    <p>Find custom recipes that you can cook with whatever you have at home!</p>
                </div>
            <button onClick={() => goToPage('signup')}>Get Started Today</button>
            </div>
        </div>
    );
}

export function HomepageSignedIn({ goToPage }){
    return(
        <div className='signedin_container'>
            <h2>Welcome to What's 4 Diner</h2>
            <p>Find custom recipes that you can cook with whatever you
                have at home!
            </p>
            <button onClick={()=> goToPage('recipes')}>Find Recipes Today</button>        
        </div>
    );
}