import React from "react";
import linkedin from '../images/linkedin.png';
import logo from '../images/food.png'

export function Footer(){
    return(
        <section className="footer">
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <div className="message">
                <p>&copy; 2025 Ayush Patel. All rights reserved</p>
                <p>Built in Montreal, Canada</p>
            </div>
            <div className="contact">
                <a href="https://www.linkedin.com/in/ayush-patel-montreal/" target="blank"><img src={linkedin} alt="linkedin" /></a>
            </div>

        </section>
    );
}