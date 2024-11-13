import {React, useState} from 'react'

export function Signin_Box(){
    return (
        <div className="signincontainer">
            
            <h2>Sign Up</h2>
            <form>
                <div>
                    <label htmlFor="">Email</label>
                    <input type="text" 
                    required
                    />
                </div>

                <div>
                    <label htmlFor="">Password</label>
                    <input type="text" 
                    required
                    />
                </div>
                <button>Sign In</button>
            </form>
        </div>
    );
}

export function Create_Account(){
    return(
        <div className="create_acc_container">
            <h2>Create an Account</h2>
            <form>
                <div>
                    <label htmlFor="">Email</label>
                    <input type="text" 
                    required
                    />
                </div>

                <div>
                    <label htmlFor="">Password</label>
                    <input type="text" 
                    required
                    />
                </div>

                <div>
                    <label htmlFor="">Confirm Password</label>
                    <input type="text" 
                    required
                    />
                </div>
                <button>Create Account</button>
            </form>

        </div>
    );
}

export function Signup_Google_Box(){
    return(
        <div className="Google_container">
            <button>Sign in with Google</button>
        </div>
    );
}