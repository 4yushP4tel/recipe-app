import React, { useEffect, useState } from "react";
import axios from "axios";

export function ChefAI() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [user_name, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getuserName = async () => {
            try {
                const response = await axios.get("https://whats4dinner.onrender.com/check_auth",
                    { withCredentials: true });
                setUserName(response.data.user_name);
            } catch (error) {
                console.error("Error getting username:", error);
            }
        }; getuserName();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (input.trim()) {
            const newMessage = { role: "user", content: input };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInput("");
            setIsLoading(true);
            try {
                const response = await axios.post("https://whats4dinner.onrender.com/chefai",
                    {
                        prompt: input,
                        user_name: user_name,
                    },
                    { withCredentials: true });
                const assistantMessage = { role: "assistant", content: response.data.response_message };

                setMessages((prevMessages) => [...prevMessages, assistantMessage]);

            } catch (error) {
                console.error("Error sending message:", error);
            } finally {
                setIsLoading(false);
            }

        } else {
            alert("Please enter a message");
        }

    };



    return (
        <div className="chefai_page">
            <div className="top_message">
                <h2>Chat With ChefAI 🧑‍🍳</h2>
                <p>Discover recipes and get cooking advice from an AI chef</p>
                <p>Start your conversation!</p>
            </div>
            <div className="chat_container">

                <div className="chat_output_container">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
                        >
                            <strong>{msg.role === "user" ? user_name : "ChefAI"}:</strong> {msg.content}
                        </div>
                    ))}
                </div>

                <div className="chat_input_container">
                    <form onSubmit={handleSendMessage}>
                        <textarea
                            id="input_message"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            rows="1"
                        >

                        </textarea>

                        <button type="submit" disabled={isLoading}>Send</button>
                    </form>
                </div>
                <p className={`chef_emoji ${isLoading ? "bouncing" : ""}`}>🧑‍🍳</p>


            </div>

        </div>
    );
}