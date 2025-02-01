import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

export function Recipes() {
    const [mode, setMode] = useState("view");
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [recipe_search, setRecipe_search] = useState([]);
    const [view_res, setView_res] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserID] = useState(0);
    const [saved, setSaved] = useState([])



    useEffect(() => {
        const getInfo = async () => {
            try {
                const response = await axios.get("/api/pantry", { withCredentials: true });
                setIngredients(response.data.ingredients);
                setUserID(response.data.user_id)

                const saved_response = await axios.get("/api/recipes", {withCredentials: true})
                const all_saved = saved_response.data.saved_recipes;
                const id_arr = []
                all_saved.map((item)=>{
                    id_arr.push(item.id_from_api);
                })
                console.log(id_arr);

                const saved_json = []
                id_arr.map(async (id)=>{
                    const id_response = await axios.get(`/spoonacular_id_search/${id}/information`, {params : {apiKey: apiKey} , withCredentials:true});
                    const info = id_response.data;
                    const name = info.title;
                    const image = info.image;
                    const ingredient_info = info.extendedIngredients;
                    const ingredient_arr = [];
                    ingredient_info.map((item)=>{
                        ingredient_arr.push({
                            ingredient_name : item.name,
                            amount: item.original
                        });
                    });
                    saved_json.push({
                        recipe_name: name,
                        image: image,
                        ingredients: ingredient_arr
                    });
                });

                setSaved(saved_json);
                console.log(saved);

            } catch (error) {
                console.log(error);
            }
        };
        getInfo();
    }, [])



    const handleSearch = async (e) => {
        e.preventDefault()

        try {
            setView_res(false)
            setLoading(true)
            if (selectedIngredients.length === 0) {
                alert("Please select some ingredients!");
                setLoading(false);
                return;
            } else if (selectedIngredients.length > 10) {
                alert("You have choosen too many ingredients! Please select fewer than 10.");
                setLoading(false);
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
                setView_res(true)
                setLoading(false)

            });

            console.log(recipe_search_results);
            setRecipe_search(recipe_search_results);

        } catch (e) {
            console.log(e)
        } 

    }

    const handleSave = async ( id, name, index) => {

        try {
            await axios.post("/api/recipes", {
                "user_id" : userId,
                "id_from_api": id,
                "recipe_name": name,
            }, {withCredentials:true});

            alert(`${name} has been saved`)

            const newRecipes = [...recipe_search];
            newRecipes.splice(index,1);
            setRecipe_search(newRecipes)

        
        } catch (error){
            console.log(error);

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
                        menuPortalTarget={null} // Disable portal to render dropdown inside the container
                        styles={{
                            control: (base) => ({
                                ...base,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                boxShadow: "none",
                                "&:hover": {
                                    borderColor: "#888",
                                },
                            }),
                            menu: (base) => ({
                                ...base,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                position: 'relative',
                                marginTop: "4px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }),
                            option: (base, { isFocused, isSelected }) => ({
                                ...base,
                                backgroundColor: isSelected
                                    ? "#007bff"
                                    : isFocused
                                        ? "#f0f0f0"
                                        : "white",
                                color: isSelected ? "white" : "black",
                                fontSize: '17px',
                                padding: '5px'
                            }),
                            multiValue: (base) => ({
                                ...base,
                                backgroundColor: "#e0e0e0",
                                borderRadius: "4px",
                                fontSize: '20px'
                            }),
                            multiValueLabel: (base) => ({
                                ...base,
                                color: "#333",
                            }),
                            multiValueRemove: (base) => ({
                                ...base,
                                color: "#666",
                                "&:hover": {
                                    backgroundColor: "#ccc",
                                    color: "#333",
                                },
                            }),
                        }}




                    />
                    <button type="submit">Search Recipes</button>
                </form>
            </div>
            {loading && <div className="search_wait_message">One moment as we find amazing recipes...</div>}
            {view_res && (<div className="search_results">
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
                                    <td><button onClick={()=>handleSave(item.id, item.recipe_name, index)}>Save Recipe</button></td>
                                </tr>)

                        })}
                    </tbody>
                </table>
            </div>)}
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
