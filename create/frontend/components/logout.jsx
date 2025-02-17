import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Logout = ({ setStatus }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("https://whats4dinner.onrender.com/logout", { withCredentials: true });
            const authResponse = await axios.get("https://whats4dinner.onrender.com/check_auth", { withCredentials: true });
            const authStatus = authResponse.data.auth_status;
            setStatus(authStatus);
            navigate("/");
        } catch (error) {
            console.log("Error logging out: ", error);
        }
    }

    const handleLogoutWithConfirm = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            handleLogout();
        }
    }

    return (
        <button className="logout_button" onClick={handleLogoutWithConfirm}>Logout</button>
    );
};