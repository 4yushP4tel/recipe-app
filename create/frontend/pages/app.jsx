import React, {useState} from 'react';
import { Header } from '../components/header';
import { Homepage } from './homepage';
import { Signup } from './signup_page';
import { ChefAI } from './chefai';
import { Pantry } from './pantry';

export function App(goToPage){
    const [page, setPage] = useState('home');

    const choosePage = () => {
        switch (page) {
            case 'home':
                return <Homepage goToPage = {setPage}/>;
            case 'signup':
                return <Signup goToPage = {setPage}/>;
            case 'pantry':
                return <Pantry goToPage = {setPage}/>;
            case 'chefai':
                return <ChefAI goToPage = {setPage}/>;
            default:
                return <Homepage goToPage={setPage}/>;
        }
    };
    return(
        <>
            <Header goToPage={setPage}/>
            <div>{choosePage()}</div>
        </>  
    );

}