import { React, useState } from 'react';

export function Homepage({goToPage}){
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