import { Signin_Box, Create_Account, Signup_Google_Box, } from
    '../components/signup_boxes';
import food_image from '../images/food.png'
import { React, useState } from 'react'
import { Link } from 'react-router-dom';

export function Signup({ setStatus }) {

    const [curr_method, setCurr_method] = useState('Sign_In')

    return (
        <div className='signup_page'>
            <div className='header-container'>
                <img src={food_image} alt="food_icon" />
                <Link to = {"/"} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h1>What's 4 Dinner</h1>
                </Link>
            </div>
            <div className='signup_container'>
                {curr_method === 'Sign_In' && <Signin_Box setStatus={setStatus} />}
                {curr_method === 'Create_Account' && <Create_Account setStatus={setStatus} />}
                <Signup_Google_Box setStatus={setStatus}/>

                <div className='method-buttons'>
                    <button onClick={() => setCurr_method('Sign_In')}>Sign In</button>
                    <button onClick={() => setCurr_method('Create_Account')}>Create Account</button>
                </div>


            </div>
        </div>


    );
}