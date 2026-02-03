import React from 'react'
import './Newsletter.css'

export const Newsletter = () => {
  function newsletterHandler(formData){
    const email = formData.get("emailForNewsletter")
    console.log("Subscribed successfully")
  }
  return (
    <section className="newsletter-section">
      <h2 className="newsletter-title">“Be The First To Know”</h2>
      <p className="newsletter-subtitle">
        Subscribe To Our Newsletter For Fresh Job Openings And Expert Career Tips—Straight To Your Inbox.
      </p>
      <form
        className="newsletter-form"
        action={newsletterHandler}
        // Handle it with the backend and also add method
      >
        <input
          type="email"
          name="emailForNewsletter"
          aria-label="email for newsletter"
          placeholder="Enter your email"
          className='newsletter-input'
        />
        <button className='newsletter-button' type="submit">Subscribe</button>
      </form>
    </section>
  )
}
