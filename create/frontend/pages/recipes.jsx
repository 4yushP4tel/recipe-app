import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

export function Recipes() {
    const [mode, setMode] = useState("view");
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [userID, setUserID] = useState(0);
    const [recipe_search, setRecipe_search] = useState([]);
    const [search_res, setSearch_res] = useState(false)

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

            const response = await axios.get('/spoonacular_ingredient_search', {
                params: {
                    apiKey: apiKey,
                    ingredients: selectedString
                }
            },
                { withCredentials: true });

            const recipe_search_results = [];

            response.data.map((item) => {
                const missedIngredients = []
                const usedIngredients = []
                const missed_ing = item.missedIngredients;
                missed_ing.map((missedIng) => {
                    missedIngredients.push({
                        "name": missedIng.name,
                        "amount": missedIng.original
                    })
                });

                const used_ing = item.usedIngredients;
                used_ing.map((usedIng) => {
                    usedIngredients.push({
                        "name": usedIng.name,
                        "amount": usedIng.original
                    })
                });

                recipe_search_results.push({
                    "id": item.id,
                    "recipe_name": item.title,
                    "image": item.image,
                    "missedIngredients": missedIngredients,
                    "usedIngredients": usedIngredients


                });
            });

            console.log(recipe_search_results);
            setRecipe_search(recipe_search_results);

        } catch (e) {
            console.log(e)
        } finally {
            setSearch_res(true)
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
                <table>
                    <thead>
                        <tr>
                            <th>Recipe</th>
                            <th>Image</th>
                            <th>Ingredients that you have</th>
                            <th>Amount</th>
                            <th>Ingredients that you don't have</th>
                            <th>Amount</th>
                            <th>Instructional Video</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recipe_search.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.recipe_name}</td>
                                    <td><img src={item.image} alt={item.recipe_name} width={"150px"} /></td>
                                    <td>
                                        <ul>
                                            {item.usedIngredients.map((usedIng, index) => {
                                                return (
                                                    <li key={index}>{usedIng.name}</li>)
                                            })}

                                        </ul>
                                    </td>
                                    <td>
                                        <ul>
                                            {item.usedIngredients.map((usedIng, index) => {
                                                return (
                                                    <li key={index}>{usedIng.amount}</li>)
                                            })}
                                        </ul>
                                    </td>

                                    <td>
                                        <ul>
                                            {item.missedIngredients.map((missedIng, index) => {
                                                return (
                                                    <li key={index}>{missedIng.name}</li>)
                                            })}

                                        </ul>
                                    </td>

                                    <td>
                                        <ul>
                                            {item.missedIngredients.map((missedIng, index) => {
                                                return (
                                                    <li key={index}>{missedIng.amount}</li>)
                                            })}
                                        </ul>
                                    </td>
                                    <td>🎥</td>
                                    <td><button>Save Recipe</button></td>
                                </tr>)

                        })}
                    </tbody>
                </table>
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
