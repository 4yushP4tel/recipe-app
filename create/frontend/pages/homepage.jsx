import React, {useState } from 'react';

export function HomepageSignedOut({goToPage}){
    return(
        <div>
            <h2>Welcome to What's 4 Diner</h2>
            <p>Find custom recipes that you can cook with whatever you
                have at home!
            </p>
            <button onClick={() => goToPage('signup')}>Get Started Today</button>
        
        </div>
    );
}

export function HomepageSignedIn({ goToPage }){
    return(
        <div>
            <h2>Welcome to What's 4 Diner</h2>
            <p>Find custom recipes that you can cook with whatever you
                have at home!
            </p>
            <button onClick={()=> goToPage('recipes')}>Find Recipes Today</button>        
        </div>
    );
}