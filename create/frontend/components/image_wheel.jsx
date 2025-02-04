import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation } from 'swiper/modules'
import { ArrowLeft, ArrowRight } from 'phosphor-react'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import food1 from '../images/food1.png'
import food2 from '../images/food2.png'
import food3 from '../images/food3.png'
import food4 from '../images/food4.png'
import food5 from '../images/food5.png'



export function Wheel() {
    const images = [food1, food2, food3, food4, food5]
    return (
        <div className="imagewheel">
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={1}
                coverflowEffect={{
                    rotate: 0,
                    stretch: -75,
                    depth: 250,
                    modifier: 3.5,
                    slideShadows: false,
                }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                    clickable: true,
                }}
                modules={[EffectCoverflow, Navigation]}
                autoplay={false}
            >

                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img src={image} alt="Food" />
                    </SwiperSlide>

                ))}

                <div className='slider-controler'>
                    <div className='swiper-button-prev'>
                        <ArrowLeft size={35} />
                    </div>
                    <div className='swiper-button-next'>
                        <ArrowRight size={35} />
                    </div>
                </div>
            </Swiper>


        </div>
    );
}