import React from "react";
import socials from "../data/socials";

const Contact = () => {

    return (
        <section className="contact-section">
            <h1 className="header">Contact</h1>
            <div className="contact-container">
                <form className="contact-form" action="mailto:aman.jukaku@gmail.com" encType="text/plain">
                    {/* <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required /> */}
                    <input type="hidden" name="subject" value={"Contacting from Portfolio"}></input>
                    <label htmlFor="body">Message</label>
                    <textarea id="body" name="body" required></textarea>
                    <button className="btn-submit" type="submit">Submit</button>
                </form>
                <div className="contact-social">
                    {
                        socials.map((social, index) => {
                            return (
                                <div key={ index } className="social-link">
                                    <a href={ social.url } target="_blank" className="social-link-container" rel="noreferrer">
                                        <img src={ social.icon } alt={ social.name } />
                                    </a>
                                    <p>{ social.name }</p>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </section>
    )
};

export default Contact;