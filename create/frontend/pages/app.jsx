import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '../components/header';
import { HomepageSignedIn, HomepageSignedOut } from './homepage';
import { Signup } from './signup_page';
import { ChefAI } from './chefai';
import { Pantry } from './pantry';
import { Recipes } from './recipes';
import '../style/main.css'
import axios from 'axios'


export function App(){
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/check_auth', {withCredentials: true});
                if (response.data.auth_status) {
                    setStatus(true);
                    console.log("signedin")
                } else {
                    setStatus(false);
                    console.log('signedout')
                }
            } catch (error) {
                console.error('Error checking authentication status:', error);
                setStatus(false);
            }
        };

        checkAuthStatus();
    }, []);

    if(status === null){
        return(<div>Loading...</div>);
    }


    return(
        <Router>
            {status && <Header />} 
        
        <div className='chosen_page'>
            <Routes> 
                <Route path="/" element={status ? <HomepageSignedIn/> :<HomepageSignedOut />} />
                <Route path="/homesignedin" element = {status ? <HomepageSignedIn/>: <Navigate to="/"/>}/>
                <Route path="/signup" element={status? <Navigate to="/homesignedin"/>: <Signup/>} />
                <Route path="/pantry" element = {status ? <Pantry/>: <Navigate to="/"/>}/>
                <Route path="/chefai" element = {status ? <ChefAI/>: <Navigate to="/"/>}/>
                <Route path="/recipes" element = {status ? <Recipes/>: <Navigate to="/"/>}/>
                </Routes>

        </div>

        </Router>
    );

}
