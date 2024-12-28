import React, {useEffect, useState} from "react";
import food1 from '../images/food1.png'
import food2 from '../images/food2.png'
import food3 from '../images/food3.png'
import food4 from '../images/food4.png'
import food5 from '../images/food5.png'

export function Slideshow(){
    const images = [food1, food2, food3, food4, food5]
    const [currIndex, setCurrIndex] = useState(0)

    useEffect(()=>{
        const interval = setInterval(
            ()=>{
                setCurrIndex((prevIndex) => (prevIndex + 1) % images.length)
            }, 2000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="image_slideshow">
            <img src={images[currIndex]} alt="slideshow" />
        </div>
    );
}