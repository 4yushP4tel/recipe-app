import React , {useEffect, useState} from "react";

export function ChefAI(){
    const [message, setMessage] = useState("");

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (message.trim()){
            try{
                const response = await axios.post("/api/chefai", 
                    {message: message,},
                    {withCredentials: true});
    
                console.log(response.data.response_message);
                console.log(message);
    
            } catch (error){
                console.error("Error sending message:", error);
            }

        } else{
            alert("Please enter a message");
        }

    };



    return(
        <div className="chefai_page">
            <div className="top_message">
                <h2>Chat With ChefAI 🧑‍🍳</h2>
                <p>Discover recipes and get cooking advice from an AI chef</p>
                <p>Feature coming soon</p>
            </div>
            <div className="chat_container">
                <div className="chat_input_container">
                    <form  onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            id="input_message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit"></button>
                    </form>

                </div>

                <div className="chat_output_container">

                </div>
            </div>

        </div>
    );
}