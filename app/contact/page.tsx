"use client";

import React, { useState } from "react";
import Head from "next/head";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    option: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, option: e.target.id });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Send form data to API
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Thank you for your enquiry! Your message has been sent.");
      } else {
        alert(
          "There was an issue sending your message. Please try again later.",
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("There was an issue sending your message. Please try again later.");
    }

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      option: "",
      message: "",
    });
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>
          Contact Us | Returns, Refunds & Feedback | Noether Technologies
        </title>
        <meta
          name="description"
          content="Get in touch with Noether Technologies for queries about returns, refunds, and feedback. Contact us by phone, email, or use our contact form."
        />
        <meta
          name="keywords"
          content="Contact Us, Noether Technologies, Returns, Refunds, Feedback, Customer Support"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.shopstrider.com/contact" />

        {/* Open Graph Meta Tags for social sharing (Facebook, LinkedIn) */}
        <meta
          property="og:title"
          content="Contact Us | Returns, Refunds & Feedback | Noether Technologies"
        />
        <meta
          property="og:description"
          content="Reach out to Noether Technologies with any queries regarding returns, refunds, or feedback. Our customer support is here to help."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.shopstrider.com/contact" />

        {/* Additional Meta Tags */}
        <meta name="author" content="Noether Technologies LLP" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </Head>

      <section className="bg-gray-100">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
            {/* Contact Info Section */}
            <div className="lg:col-span-2 lg:py-12">
              <p className="max-w-xl text-lg font-bold text-black">
                We are committed to providing the best support to our customers.
                If you have any queries regarding returns, refunds, or feedback,
                please contact us using the details below or via the form.
              </p>

              <div className="mt-8">
                <a
                  href="tel:+917384620893"
                  className="text-2xl font-bold text-black"
                >
                  +91 7384620893
                </a>
                <address className="mt-2 not-italic font-bold text-black">
                  Noether Technologies LLP, School Bagan, Bolpur, West Bengal,
                  India
                </address>
                <a
                  href="mailto:noethertechnologies@gmail.com"
                  className="font-bold text-black"
                >
                  noethertechnologies@gmail.com
                </a>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="sr-only" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm font-bold text-black"
                    placeholder="Name"
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Email and Phone Fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="sr-only" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm font-bold text-black"
                      placeholder="Email address"
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm font-bold text-black"
                      placeholder="Phone Number"
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Options: Return, Refund, Feedback */}
                <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="Return"
                      className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 font-bold text-black hover:border-black"
                      tabIndex={0}
                    >
                      <input
                        className="sr-only"
                        id="Return"
                        type="radio"
                        name="option"
                        onChange={handleOptionChange}
                        checked={formData.option === "Return"}
                      />
                      <span className="text-sm">Return</span>
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="Refund"
                      className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 font-bold text-black hover:border-black"
                      tabIndex={0}
                    >
                      <input
                        className="sr-only"
                        id="Refund"
                        type="radio"
                        name="option"
                        onChange={handleOptionChange}
                        checked={formData.option === "Refund"}
                      />
                      <span className="text-sm">Refund</span>
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="Feedback"
                      className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 font-bold text-black hover:border-black"
                      tabIndex={0}
                    >
                      <input
                        className="sr-only"
                        id="Feedback"
                        type="radio"
                        name="option"
                        onChange={handleOptionChange}
                        checked={formData.option === "Feedback"}
                      />
                      <span className="text-sm">Feedback</span>
                    </label>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="sr-only" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    className="w-full rounded-lg border-gray-200 p-3 text-sm font-bold text-black"
                    placeholder="Message"
                    rows={8}
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                  <button
                    type="submit"
                    className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                  >
                    Send Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
