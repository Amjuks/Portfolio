import React, { useState, useEffect, useRef } from 'react';
import { name, titles } from '../data/titles';
import profilePic from '../assets/profile/Aman.jpg';

const Intro = () => {
    const [title, setTitle] = useState(titles[0]);
    const titleRef = useRef(null);
    const bgColor = "F9F7F3";
    
    useEffect(() => {
        let index = 0;
        
        const updateText = () => {
            index = (index + 1) % titles.length;
            setTitle(titles[index]);
        }

        const titleElement = titleRef.current;
        if (titleElement) {
            titleElement.addEventListener("animationiteration", updateText);
        }

        return () => {
            if (titleElement) {
                titleElement.removeEventListener("animationiteration", updateText);
            }
        };
    }, []);

    return (
        <section className="intro">
            <iframe src={`https://amjuks.github.io/Particle-Life-Simulation/?bg=%23${bgColor}&n=500&nc=5&radius=2&forceRadius=160&forcePower=1&matrixEvolutionDelta=1&matrixEvolutionDuration=2000&nointerrupt=true`} title="Particle Life Simulation"></iframe>
            <div className="profile-info">
                <div className="avatar-container">
                    <img src={ profilePic } alt="Profile" className="avatar" />
                </div>
                <div className="profile-name">
                    <h1 className="name">{ name }</h1>
                    <div className="profile-sub">
                        <p className="title" ref={titleRef}>{ title }</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Intro;