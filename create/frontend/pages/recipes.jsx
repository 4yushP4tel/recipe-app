import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const apiURL = import.meta.env.VITE_SPOONACULAR_URL;
const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

export function Recipes() {
    const [mode, setMode] = useState("view");
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [userID, setUserID] = useState(0);
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const getIngredients = async () => {
            try {
                const response = await axios.get("/api/pantry", { withCredentials: true });
                setIngredients(response.data.ingredients);
                setUserID(response.data.user_id)
            } catch (error) {
                console.log(error);
            }
        };
        getIngredients();
    }, [])



    const handleSearch = async (e) => {
        e.preventDefault()

        try {

            if (selectedIngredients.length === 0) {
                alert("Please select some ingredients!")
                return;
            } else if (selectedIngredients.length > 10) {
                alert("You have choosen too many ingredients! Please select fewer than 10.")
                return;
            }
            const selected_ingredient_arr = selectedIngredients.map(
                (ingredient) => (ingredient.label).toLowerCase()
            );
            const selectedString = selected_ingredient_arr.join(",")
            console.log(selectedString)

            const endpoint = `${apiURL}?apiKey=${apiKey}&ingredients=${selectedString}`;
            console.log(endpoint);
            
            const response = await axios.get(endpoint,
                { withCredentials: true });

            console.log(response)





        } catch (e) {
            console.log(e)
        }

    }

    const handleSave = async (e) => {
        e.preventDefault();

        try {

        } catch {

        }
    }

    const view_section = (
        <div className="view_section">
            view
        </div>
    );

    const search_section = (
        <div className="search_section">
            <h3>Select your desired ingredients:</h3>
            <div className="ingredients_select">
                <form onSubmit={handleSearch}>
                    <Select
                        isMulti
                        options={ingredients.map(ingredient => ({
                            value: ingredient.id,
                            label: ingredient.ingredient_name,
                        }))}
                        value={selectedIngredients}
                        onChange={setSelectedIngredients}
                        placeholder="Select Ingredients"
                    />
                    <button type="submit">Search Recipes</button>
                </form>
            </div>
            <div className="search_results">

            </div>
        </div>
    );

    return (
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
