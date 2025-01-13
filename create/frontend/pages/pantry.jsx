import React, {useState, useEffect} from "react";
import axios from "axios";
import '../style/main.css'

export function Pantry(){
    const [items, setItems] = useState([]);
    const [ingredient, setIngredient] = useState("");
    const [seetable, setSeetable] = useState(false);

    

    const handleAdd = async (e) => {
        e.preventDefault();

        if (ingredient.trim()){
            setItems([...items, ingredient.trim()]);
            setIngredient("");
        } else{
            alert("Please enter an ingredient");
        }
    }

    const handleRemove = async (itemId) => {
        try{
            //await axios.delete(`/api/pantry/${itemId}`);
            setItems(items.filter((item) => item.id !== itemId));
        } catch (error){
            console.error('Error removing item:', error);
        }
    }


    const user_name = 'John Doe'; 

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
                <div className="table_container"> 
                    <h1>{user_name}'s Pantry</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Ingredient</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item,index) =>(
                                <tr key={index}>
                                    <td>{item}</td>
                                    <td>
                                        <button onClick={() => handleRemove(item.id)}>Remove</button>
                                    </td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}