import {React, useState} from 'react'
import axios from 'axios';

export function Signin_Box(){
    const [visible, setVisible] = useState(false)

    return (
        <div className="signincontainer">
            
            <h2>Sign In</h2>
            <form>
                <div className='inputfield'>
                    <label className='signuplabels'>Username</label>
                    <input type="text" 
                    required
                    />
                </div>
                <div className='inputfield'>
                    <label className='signuplabels'>Email</label>
                    <input type="email" 
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

    const [formData, setFormData] = useState({
        user_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/create_user", {
                user_name: formData.user_name,
                email: formData.email,
                password: formData.password,
                confirm_password: formData.confirm_password
            });
            setSuccess(response.data.message);
            setFormData({ user_name: "", email: "", password: "", confirm_password: "" });
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error);
            } else {
                setError("An error occurred. Please try again.");
                console.log('error occured when trying to submit')
            }
        }
    };

    return(
        <div className="create_acc_container">
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit}>
                <div className='inputfield'>
                    <label className='signuplabels'>Username</label>
                    <input
                        type = "text" 
                        value = {formData.user_name}
                        name='user_name'
                        onChange = {handleInputChange}
                        required
                    />
                </div>
                <div className='inputfield'>
                    <label className='signuplabels'>Email</label>
                    <input 
                        type = "email" 
                        value = {formData.email}
                        name='email'
                        onChange = {handleInputChange}
                        required
                    />
                </div>

                <div className='inputfield'>
                    <label className='signuplabels'>Password</label>
                    <input 
                        type = {visible ? "text": "password"}
                        value = {formData.password}
                        name='password'
                        onChange = {handleInputChange}
                        minLength={8}
                        maxLength={49}
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
                    <input 
                        type = "password" 
                        name='confirm_password'
                        value = {formData.confirm_password}
                        onChange = {handleInputChange}
                        required
                    />
                </div>
                <div className='continue'>
                    <button type='submit'>Continue</button>
                </div>

            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}


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