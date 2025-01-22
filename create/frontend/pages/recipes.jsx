import React, {useEffect, useState} from "react";
import Select from "react-select";
import axios from "axios";

export function Recipes(){
    const[mode, setMode] = useState("view");
    const [ingredients, setIngredients] = useState([]);
    const[selectedIngredients, setSelectedIngredients] = useState([]);
    const [userID, setUserID] = useState(0);
    const [recipes, setRecipes] = useState([]);

    useEffect(()=>{
        const getIngredients = async ()=>{
            try{
                const response = await axios.get("/api/pantry", {withCredentials: true});
                setIngredients(response.data.ingredients);
                setUserID(response.data.user_id)
            } catch(error){
                console.log(error);
            }
        };
        getIngredients();
    },[])



    const handleSearch = async (e) =>{
        e.preventDefault()

        if (selectedIngredients.length === 0){
            alert("Please select some ingredients!")
            return;
        }
        const selected_ingredient_arr = []
        selectedIngredients.map((ingredient)=>{
            selected_ingredient_arr.push(ingredient.label);
        });

        const response = await axios.post("/api/search_recipes",
            {
                selected_ingredients : selected_ingredient_arr,
                user_id : userID
            },
            {
                withCredentials: true
            }
        )

        const answer = response.data
        console.log(answer)


    }

    const view_section = (
        <div>
            view
        </div>
    );

    const search_section = (
        <div className="search_section">
            <h3>Choose which ingredients you'd like to cook with: </h3>
            <div className="ingredients_select">
                <form onSubmit = {handleSearch}>
                    <Select
                        isMulti
                        options = {ingredients.map(ingredient => ({
                            value: ingredient.id,
                            label: ingredient.ingredient_name,
                        }))}
                        value = {selectedIngredients}
                        onChange = {setSelectedIngredients}
                        placeholder = "Select Ingredients"
                        />
                    <button type="submit">Search Recipes</button>
                        

                </form>
            </div>
            <div className="search_results">

            </div>
        </div>
    );

    return(
        <div className="recipes_page">
            <div className="top_message">
                <h2>Find new recipes using the search tool</h2>
            </div>
            <div className="mode_buttons">
                <form>
                    <label> View Saved Recipes
                        <input
                        type="radio"
                        value="view"
                        onChange={(e) => setMode(e.target.value)}
                        checked={mode === "view"}
                        />
                    </label>
                    <label> Search for New Recipes
                        <input
                        type="radio"
                        value="search"
                        onChange={(e) => setMode(e.target.value)}
                        checked={mode === "search"}
                        />
                    </label>

                </form>

            </div>
            {mode === "view" ? view_section : search_section}


        </div>
    );
}
