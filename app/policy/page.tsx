import React from "react";
import Head from "next/head";

const PolicyPage = () => {
  return (
    <div className="p-8">
      <Head>
        {/* Title and Meta Description */}
        <title>
          Policies | Privacy Policy, Return and Refund Policy, Security Policy
        </title>
        <meta
          name="description"
          content="Read our comprehensive Privacy Policy, Return and Refund Policy, and Security Policy to understand how we protect your data, handle returns, and ensure safe transactions."
        />

        {/* Meta Keywords */}
        <meta
          name="keywords"
          content="Privacy Policy, Return Policy, Refund Policy, Security Policy, data protection, secure payments, SSL encryption, online security, refunds, returns"
        />

        {/* Robots Meta Tag */}
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.shopstrider.com/policies" />

        {/* Open Graph Meta Tags for Facebook/LinkedIn */}
        <meta
          property="og:title"
          content="Policies | Privacy, Refund, Security"
        />
        <meta
          property="og:description"
          content="Learn about our Privacy Policy, Return and Refund Policy, and Security Policy to understand how we protect your information and manage transactions securely."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.shopstrider.com/policies"
        />

        {/* Additional Meta Tags */}
        <meta name="author" content="Noether Technologies LLP" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-8 text-black">Our Policies</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Privacy Policy Section */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-black">Privacy Policy</h2>
          <p className="text-black font-bold">
            We are committed to protecting your privacy and ensuring that your
            personal information is handled in a safe and responsible manner.
            This policy outlines how we collect, use, and protect your data.
          </p>
          <h3 className="text-lg font-bold mt-4 text-black">Information We Collect</h3>
          <p className="text-black font-bold">
            We collect personal information such as your name, email address,
            shipping address, and payment details when you make a purchase or
            create an account on our website. We also collect browsing behavior
            and device information using cookies to enhance your experience.
          </p>
          <h3 className="text-lg font-bold mt-4 text-black">How We Use Your Information</h3>
          <p className="text-black font-bold">
            Your information is used for order fulfillment, improving our
            services, and marketing purposes. We may send you promotional emails
            based on your previous orders and preferences, but you can opt-out
            at any time.
          </p>
          <h3 className="text-lg font-bold mt-4 text-black">Data Protection</h3>
          <p className="text-black font-bold">
            We implement a variety of security measures to maintain the safety
            of your personal information.
          </p>
        </div>

        {/* Return and Refund Policy Section */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-black">Return and Refund Policy</h2>
          <p className="text-black font-bold">
            We want you to be completely satisfied with your purchase. If you are
            not happy with the product you received, please review our return
            and refund policies below.
          </p>
          <h3 className="text-lg font-bold mt-4 text-black">Returns</h3>
          <p className="text-black font-bold">
            You have 7 days from the date of purchase to return an item for a
            refund. The item must be in its original condition and packaging.
            Products that show signs of use or damage will not be eligible for a
            return.
          </p>
          <h3 className="text-lg font-bold mt-4 text-black">Refunds</h3>
          <p className="text-black font-bold">
            Once we receive and inspect your returned item, we will notify you
            about the approval or rejection of your refund. If approved, your
            refund will be processed within 7 business days.
          </p>
          <h3 className="text-lg font-bold mt-4 text-black">Non-Returnable Items</h3>
          <p className="text-black font-bold">
            Certain products like Electronics goods, Mobile, and Grocery Items
            are not eligible for return. For Electronics Goods and Mobile,
            please contact the respective brand service center for support.
          </p>
        </div>

        {/* Security Policy Section */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-black">Security Policy</h2>
          <p className="text-black font-bold">
            We take your security seriously and implement the best practices to
            ensure your data is safe when you use our website or make a
            purchase.
          </p>
          <h3 className="text-lg font-bold mt-4 text-black">Secure Payments</h3>
          <p className="text-black font-bold">
            All transactions on our website are encrypted using SSL (Secure
            Socket Layer) technology, ensuring that your payment information is
            secure. We do not store your credit card information on our servers.
          </p>
          <h3 className="text-lg font-bold mt-4 text-black">Account Protection</h3>
          <p className="text-black font-bold">
            We recommend using a strong password for your account and never
            sharing your login credentials with anyone.
          </p>
          <h3 className="text-lg font-bold mt-4 text-black">Third-Party Services</h3>
          <p className="text-black font-bold">
            We partner with reputable third-party services for payment
            processing, data storage, and analytics. These partners are vetted
            to ensure they comply with industry-standard security practices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
