import React, {useEffect, useState} from "react";
import axios from "axios";

export function Recipes(){
    const[mode, setMode] = useState("view");
    const[selectedingredients, setSelectedIngredients] = useState([]);

    const view_section = (
        <div>
            view
        </div>
    );

    const search_section = (
        <div>
            search
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
