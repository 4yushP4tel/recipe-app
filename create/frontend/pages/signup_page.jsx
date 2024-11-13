import {Signin_Box, Create_Account,Signup_Google_Box} from 
'../components/signup_boxes';
import {React, useState} from 'react'

export function Signup(){

    const [curr_method, setCurr_method] = useState('Sign_In')

    return(
        <>
            {curr_method === 'Sign_In' && <Signin_Box/>}
            {curr_method === 'Create_Account' && <Create_Account/>}
            <Signup_Google_Box/>

            <button 
                onClick={() => setCurr_method('Sign_In')}>
            Sign In
            </button>
            <button 
                onClick={() => setCurr_method('Create_Account')}>
            Create Account
            </button>
        </>

        
    );
}