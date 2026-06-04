import React from "react";

function ContactPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Contact Us</h1>

      <p className="mb-4">
        Have questions, feedback, or suggestions? We'd love to hear from you.
      </p>

      <form>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea
            className="form-control"
            rows="5"
            placeholder="Write your message here"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactPage;