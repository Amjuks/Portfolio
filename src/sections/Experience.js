import React, { useEffect, useRef } from 'react';
import experience from '../data/experience';

const Experience = () => {

    const timelineRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        const timeline = timelineRef.current;
        const dot = dotRef.current;
        if (!timeline || !dot) return;

        const initialOffset = 0;
        const bottomMargin = 0;

        const updateDotPosition = () => {
            const timelineRect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (timelineRect.bottom < 0 || timelineRect.top > windowHeight) {
                dot.classList.remove('visible');
                return;
            } else {
                dot.classList.add('visible');
            }

            let desiredPosition = windowHeight / 2 - timelineRect.top;
            const maxPosition = timeline.offsetHeight - bottomMargin - dot.offsetHeight;

            if (desiredPosition < initialOffset) {
                desiredPosition = initialOffset;
            } else if (desiredPosition > maxPosition) {
                desiredPosition = maxPosition;
            }

            dot.style.top = desiredPosition + "px";
        }

        window.addEventListener('scroll', updateDotPosition);
        window.addEventListener('resize', updateDotPosition);

        updateDotPosition();

        return () => {
            window.removeEventListener('scroll', updateDotPosition);
            window.removeEventListener('resize', updateDotPosition);
        };      
    }, []);

    return (        
        <section className="experience">
            <h1 className='header'>Experience</h1>
            <div className="timeline" ref={ timelineRef }>
                {
                    experience.map((exp, index) => (
                        <div key={ index } className="timeline-item">
                            <div className="timeline-item-content">
                                <p className="exp-time">{ exp.duration }</p>
                                <h3 className="exp-company">{ exp.company }</h3>
                                <p className="exp-description">
                                    { exp.description }
                                </p>
                                <div className="exp-skills">
                                    {
                                        exp.skills.map((skill, index) => (
                                            <p className="skill" key={ index }>{ skill }</p>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div className="timeline-dot" ref={ dotRef }></div>
            </div>
        </section>
    );
}

export default Experience;