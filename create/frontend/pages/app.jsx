import React, {useState, useEffect} from 'react';
import { Header } from '../components/header';
import { HomepageSignedIn, HomepageSignedOut } from './homepage';
import { Signup } from './signup_page';
import { ChefAI } from './chefai';
import { Pantry } from './pantry';
import { Recipes } from './recipes';
import '../style/main.css'
import axios from 'axios'


export function App(){
    const [status, setStatus] = useState(true);
    const [page, setPage] = useState(status ? 'homesignedin':'homesignedout');

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/check_auth');
                if (response.data.auth_status) {
                    setStatus(true);
                    setPage('homesignedin');
                    console.log("signedin")
                } else {
                    setStatus(false);
                    setPage('homesignedout');
                    console.log('signedout')
                }
            } catch (error) {
                console.error('Error checking authentication status:', error);
                setStatus(false);
                setPage('homesignedout');
                console.log('error in status recognition')
            }
        };

        checkAuthStatus();
    }, []);


    const choosePage = () => {
        switch (page) {
            case 'homesignedout':
                return <HomepageSignedOut goToPage = {setPage}/>;
            case 'signup':
                return <Signup goToPage = {setPage}/>;
            case 'homesignedin':
                return <HomepageSignedIn goToPage = {setPage}/>;
            case 'pantry':
                return <Pantry goToPage = {setPage}/>;
            case 'chefai':
                return <ChefAI goToPage = {setPage}/>;
            case 'recipes':
                return <Recipes goToPage = {setPage}/>;
            default:
                return <HomepageSignedOut goToPage = {setPage}/>;

                
        }
    };

    return(
        <div>
        {status && <Header goToPage={setPage}/>}
        <div className='chosen_page'>{choosePage()}</div>
        
        </div>
    );

}
