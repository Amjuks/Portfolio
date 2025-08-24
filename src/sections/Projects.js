import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import { ReactComponent as TopWave } from '../assets/svgs/TopWave.svg';
import { ReactComponent as BottomWave } from '../assets/svgs/BottomWave.svg';
import slides from '../data/projects';

const Projects = () => {
    const swiperRef = useRef(null);
    return (
        <>
            <section className='projects'>
                <TopWave />
                <h1 className='header'>Projects</h1>
                <div className='swiper-container'>
                    <Swiper
                        modules={[EffectCoverflow, Autoplay]}
                        effect='coverflow'
                        loop={true}
                        grabCursor={true}
                        centeredSlides={true}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            768: { slidesPerView: 1.5 }
                        }}          
                        autoplay={{
                            delay: 2500,
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
                        className='projects-swiper'
                    >
                        {slides.map((slide, index) => (
                            <SwiperSlide key={ index }>
                                <img src={ slide.image } alt='project-image'></img>
                                <div className="slide-info">
                                    <h1 className='slide-title'>{ slide.title }</h1>
                                    <p className='project-description'>{ slide.description }</p>
                                    {
                                        slide.tools.length > 0 && 
                                        <>
                                            <hr />
                                            <h3 className='sub-title'>Tech</h3>
                                            <p className='tools'>
                                                {
                                                    slide.tools.join(", ")
                                                }
                                            </p>
                                        </>
                                    }
                                    { slide.sources && 
                                        <>
                                            <hr />
                                            <h3 className='sub-title'>Source Code</h3>
                                            <div className='source-links'>
                                            {
                                                slide.sources.map((source, index) => (
                                                    <a className='source-link' href={source.url} target='_blank' rel='noreferrer' key={index}>
                                                        <FontAwesomeIcon icon={source.icon} />
                                                        {source.title}
                                                    </a>
                                                ))
                                            }
                                            </div>
                                        </>
                                    }
                                    <hr />
                                    <h3 className='sub-title'>Live Demos</h3>
                                    { slide.demos && slide.demos.length > 0 ? (
                                            slide.demos.map((demo, index) => (
                                                <a className='live-link' href={demo.url} target='_blank' rel='noreferrer' key={index}>
                                                    <FontAwesomeIcon icon={demo.icon} />
                                                    {demo.title}
                                                </a>
                                            ))
                                        ) : (
                                            <a className='live-link' href='#' target='_blank' rel='noreferrer' key={index}>
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                    Coming Soon
                                            </a>
                                        )
                                    }
                                    { slide.blogs && 
                                        <>
                                            <hr />
                                            <h3 className='sub-title'>Blogs</h3>
                                            <div className='source-links'>
                                            {
                                                slide.blogs.map((blog, index) => (
                                                    <a className='source-link' href={blog.url} target='_blank' rel='noreferrer' key={index}>
                                                        <FontAwesomeIcon icon={blog.icon} />
                                                        {blog.title}
                                                    </a>
                                                ))
                                            }
                                            </div>
                                        </>
                                    }
                                </div>
                            </SwiperSlide>
                        ))}

                    </Swiper>
                </div>
                <BottomWave />
            </section>
        </>
    );
};

export default Projects;