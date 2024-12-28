import {React, useState} from 'react'

export function Signin_Box(){
    const [visible, setVisible] = useState(false)
    return (
        <div className="signincontainer">
            
            <h2>Sign In</h2>
            <form>
                <div className='inputfield'>
                    <label className='signuplabels'>Email</label>
                    <input type="text" 
                    required
                    />
                </div>

                <div className='inputfield'>
                    <label className='signuplabels'>Password</label>
                    <input type={visible ? "text": "password"}
                    required
                    />
                    <div className='visibility'>
                        <button onClick={(event)=> {event.preventDefault();setVisible(!visible)}}>
                        {visible ? "🙉": "🙈"}
                        </button>

                    </div>

                </div>
                <div className='continue'>
                    <button>Continue</button>
                </div>
            </form>
        </div>
    );
}

export function Create_Account(){
    const [visible, setVisible] = useState(false)
    return(
        <div className="create_acc_container">
            <h2>Create an Account</h2>
            <form>
                <div className='inputfield'>
                    <label className='signuplabels'>Email</label>
                    <input type="text" 
                    required
                    />
                </div>

                <div className='inputfield'>
                    <label className='signuplabels'>Password</label>
                    <input type={visible ? "text": "password"}
                    required
                    />
                    <div className='visibility'>
                        <button onClick={(event)=> {event.preventDefault();setVisible(!visible)}}>
                        {visible ? "🙉": "🙈"}
                        </button>

                    </div>
                </div>

                <div className='inputfield'>
                    <label className='signuplabels'>Confirm Password</label>
                    <input type="password" 
                    required
                    />
                </div>
                <div className='continue'>
                    <button>Continue</button>
                </div>

            </form>

        </div>
    );
}

export function Signup_Google_Box(){
    return(
        <div className="Google_container">
            <button className='method-buttons'>Sign in with Google</button>
        </div>
    );
}