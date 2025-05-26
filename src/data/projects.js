import number_generator from '../assets/projects/number_generator.png';
import scenery_generator from '../assets/projects/scenery_generator.png';
import particle_life_simulation from '../assets/projects/particle_life_simulation.png';

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

let projects_ = [
    {
        "title": "Handwritten Digit Recognition and Generation",
        "description": "This project uses the MNIST dataset and machine learning to recognize handwritten digits with accuracy and generate new ones. I built a user-friendly Flask-based webpage to showcase the model's capabilities.",
        "image": number_generator,
        "tools": ["Python", "TensorFlow", "Flask", "Kaggle"],
        "sources": [
            {
                "title": "Github Repository",
                "url": "https://github.com/Amjuks/Handwritten-Digit-Recognition-and-Generation",
                "icon": faGithub
            }
        ],
        "demos": [

        ]
    },
    {
        "title": "Scenery Generation using GANs",
        "description": "This project dives into the fascinating realm of Generative Adversarial Networks (GANs) to generate stunning scenery images. The model was trained using a Kaggle dataset of random scenery images, and I created a Flask-based webpage to showcase its capabilities interactively.",
        "image": scenery_generator,
        "tools": ["Python", "TensorFlow", "Flask", "Kaggle"],
    },
    {
        "title": "Particle Life Simulation",
        "description": "This project explores the exciting world of particle life simulation.",
        "image": particle_life_simulation,
        "tools": ["Web Development", "JavaScript"],
        "blogs": [
            {
                "title": "Medium Article",
                "url": "https://medium.com/@aman.jukaku/particle-life-simulating-the-emergence-of-order-from-chaos-e006dbcc574a",
                "icon": faExternalLinkAlt
            }
        ],
        "sources": [
            {
                "title": "Github",
                "url": "https://github.com/Amjuks/Particle-Life-Simulation",
                "icon": faGithub
            }
        ],
        "demos": [
            {
                "title": "Live Simulation",
                "url": "https://amjuks.github.io/Particle-Life-Simulation/",
                "icon": faExternalLinkAlt,
            }
        ]
    },
];

const projects = projects_.concat(projects_);

export default projects;