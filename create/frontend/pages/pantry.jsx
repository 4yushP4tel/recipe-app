import React, {useState, useEffect} from "react";
import axios from "axios";
import '../style/main.css'

export function Pantry(){
    const [items, setItems] = useState([]);
    const [ingredient, setIngredient] = useState("");
    const [username, setUserName] = useState("");
    const [userId, setUserId] = useState(0);


    useEffect(() => {
        const getData = async () => {
            try{
                const response = await axios.get("/api/pantry",
                    {withCredentials: true});

                setUserName(response.data.user_name);
                setItems(response.data.ingredients);
                setUserId(response.data.user_id);
            } catch (error){
                console.error("Error getting username:", error);
            }
        };
        getData();
    }, []);


    const handleAdd = async (e) => {
        e.preventDefault();

        if (ingredient.trim()){
            try{
                const response = await axios.post("/api/pantry", {
                    ingredient_name: ingredient.trim(),
                    user_id : userId,
                }, 
                {withCredentials: true});

                const { ingredient_id, ingredient_name } = response.data;
                setItems([...items, { id: ingredient_id, ingredient_name: ingredient_name }]);
                setIngredient("");
            } catch (error){
                console.error("Error adding ingredient:", error);

        }} else{ alert("Please enter an ingredient");
        } 
    };

    const handleRemove = async (itemId) => {
        try{
            await axios.delete(`/api/pantry/${itemId}`,
                {withCredentials: true});
            setItems(items.filter((item) => item.id !== itemId));
        } catch (error){
            console.error('Error removing item:', error);
        }
    }

    const emptyPantry = <div className="table_container">
                            <h1>{username}'s Pantry</h1>
                            <p>Your pantry is empty. Add ingredients to get started!</p>
                        </div>

    const non_emptyPantry = <div className="table_container"> 
                                <h1>{username}'s Pantry</h1>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ingredient</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item) =>(
                                            <tr key={item.id}>
                                                <td>{item.ingredient_name}</td>
                                                <td>
                                                    <button onClick={() => handleRemove(item.id)}>Remove</button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    </tbody>
                                </table>
                            </div>


    return(
        <div className="pantry_page">
            <div className="top_message">
                <h2>What's in my pantry?</h2>
                <p>Keep track of the ingredients in your pantry and fridge</p>
            </div>

            <div className="pantry_container">
                <div className="form_container">
                    <form onSubmit={handleAdd}>
                        <input
                            type="text"
                            id="pantry" 
                            name="pantry" 
                            placeholder="Enter item"
                            value={ingredient}
                            onChange={(e) => setIngredient(e.target.value)}
                        />
                        <button type="submit">Add Ingredient</button>
                    </form>
                </div>
                {items.length > 0 ? non_emptyPantry : emptyPantry 
                }

            </div>
        </div>
    );
}