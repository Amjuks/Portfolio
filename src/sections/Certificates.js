import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

import certificates from '../data/certificates';

function Certificates() {
    return (
        <section className='certificates'>
            <h1 className='header'>Certificates</h1>
            <div className='swiper-container'>
                <Swiper
                    modules={[EffectCoverflow, Autoplay]}
                    effect='coverflow'
                    loop={true}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={1.5}
                    autoplay={{
                        delay: 25000,
                        disableOnInteraction: false,
                    }}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    pauseOnMouseEnter={true}
                    className='certificates-swiper'
                >
                    {
                        certificates.map((certificate, index) => (
                            <SwiperSlide key={ index }>
                                <img src={ certificate.image } alt='certificate-image'></img>
                                <div className="slide-info">
                                    <h1 className='slide-title'>{ certificate.title }</h1>
                                    <p className='project-description'>{ certificate.description }</p>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </section>
    );
}

export default Certificates;