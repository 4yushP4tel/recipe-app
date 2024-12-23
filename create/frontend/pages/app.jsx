import React, {useState} from 'react';
import { Header } from '../components/header';
import { HomepageSignedIn, HomepageSignedOut } from './homepage';
import { Signup } from './signup_page';
import { ChefAI } from './chefai';
import { Pantry } from './pantry';
import { Recipes } from './recipes';


export function App(){
    const [status, setStatus] = useState(true);
    const [page, setPage] = useState(status ? 'homesignedin' : 'homesignedout');



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
        <>
        {status && <Header goToPage={setPage}/>}
        <div>{choosePage()}</div>
        
        </>
    );

}