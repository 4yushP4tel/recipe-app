import React from 'react';
import Marquee from 'react-fast-marquee';
import image0 from '../images/food1.png';
import image1 from '../images/food2.png';
import image2 from '../images/food3.png';
import image3 from '../images/food4.png';
import image4 from '../images/food5.png';

const images = [image0, image1, image2, image3, image4];


export function AutoCarousel() {
    return (
        <div style={{ maxWidth: '100%', overflow: 'hidden', boxShadow: '0 -10px 20px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.1)', display: 'flex', alignContent: 'center', justifyContent: 'center', margin: 'auto' }}>
            <Marquee speed={200} gradient={true}>
                <div style={{ display: 'flex' }}>
                    {images.map((image, index) => {
                        return <img key={index} src={image} alt="food"
                            style={{
                                height: '200px',
                                width: 'auto',
                                padding: '20px 50px'

                            }} />
                    })
                    }

                </div>

            </Marquee>
        </div>
    );
}