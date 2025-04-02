"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/app/firebase"; // Adjust the import according to your project structure
import { doc, getDoc } from "firebase/firestore";
import ProductsLayout from "./ProductsLayout"; // Assuming this exists and is correctly imported
import { getAuth } from "firebase/auth"; // Removed onAuthStateChanged as it's no longer needed here
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Head from "next/head";

type Product = {
  productName: string;
  images: string[];
  price: string;
  marketPrice: string; // Changed from discountedPrice to marketPrice
  brand: string;
  description: string;
  stock: number;
  deliveryInfo: string;
  emi: string;
  seller: string;
};

export default function ProductDetails() {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  // Removed: const [userUUID, setUserUUID] = useState<string | null>(null);

  useEffect(() => {
    // Reset product state when productId changes to avoid showing stale data
    setProduct(null);
    setLoading(true);

    if (productId) {
      const fetchProduct = async () => {
        try {
          const productDoc = doc(db, "products", productId as string);
          const productSnapshot = await getDoc(productDoc);
          if (productSnapshot.exists()) {
            // Basic validation (optional but good practice)
            const data = productSnapshot.data();
            if (data && typeof data.productName === 'string' && Array.isArray(data.images)) {
                 setProduct(data as Product);
            } else {
                console.error("Product data format is incorrect", data);
                setProduct(null); // Ensure product is null if data is invalid
            }
          } else {
            console.error("Product not found");
            setProduct(null); // Ensure product is null if not found
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          setProduct(null); // Ensure product is null on error
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
        // If productId is not available (e.g., on initial render before router hydrates)
        setLoading(false);
    }
  }, [productId]); // Dependency array includes productId

  // Removed the useEffect hook for onAuthStateChanged as userUUID is not used

  const addToCart = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        // Optionally pass the current page to redirect back after login
        router.push(`/login?redirect=/products/${productId}`);
        return;
      }

      // Ensure productId is available before proceeding
      if (!productId) {
         console.error("Product ID is missing.");
         // Optionally show an error message to the user
         alert("Cannot add to cart: Product ID is missing.");
         return;
      }

      const idToken = await user.getIdToken(true);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Consider adding Authorization header if your API requires it
          // "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ productId: productId, idToken: idToken }), // Send idToken if needed by backend API for verification
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong adding to cart");
      }

      console.log("Product added to cart:", data); // Use the response data if needed

      // Display confirmation dialog
      if (confirm("Product added to cart. Click OK to view your cart.")) {
        router.push("/Cart"); // Ensure the route '/Cart' exists and is correct case
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      // Inform the user about the error
      alert(`Failed to add product to cart: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  if (loading) {
    // More centered loading indicator
    return (
        <ProductsLayout>
            <div className="flex justify-center items-center min-h-screen">
               <div>Loading Product Details...</div>
            </div>
        </ProductsLayout>
    );
  }

  if (!product) {
    // Handle product not found or error state
     return (
        <ProductsLayout>
            <div className="flex justify-center items-center min-h-screen p-4 text-center">
               <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
                  <h1 className="text-xl font-bold text-red-600">Product Not Found</h1>
                  <p className="text-gray-700 mt-2">Sorry, we could not find the product you were looking for.</p>
                  <button
                    onClick={() => router.push('/')} // Go back to homepage or products page
                    className="mt-4 rounded bg-blue-500 p-3 text-sm font-medium text-white transition hover:bg-blue-600"
                  >
                    Go to Homepage
                  </button>
               </div>
            </div>
        </ProductsLayout>
     );
  }

  // Product found, render details
  return (
    <>
      <Head>
        <title>{product.productName} - Product Details</title>
        <meta
          name="description"
          content={`Buy ${product.productName} from our e-commerce platform. Explore product details, prices, and special offers.`}
        />
        <meta
          name="keywords"
          content={`${product.productName}, ${product.brand}, e-commerce, product details, buy online, best prices, special offers`} // Add product name/brand to keywords
        />
        <meta name="robots" content="index, follow" />
        {/* Add Open Graph meta tags for better social sharing */}
        <meta property="og:title" content={`${product.productName} - Product Details`} />
        <meta property="og:description" content={product.description.substring(0, 150) + '...'} />
        <meta property="og:image" content={product.images[0]} /> {/* Use the first image */}
        <meta property="og:url" content={router.asPath} /> {/* Use current URL */}
        <meta property="og:type" content="product" />
      </Head>
      <ProductsLayout>
        {/* Added pt-20 assuming ProductsLayout might have a fixed header */}
        <div className="flex justify-center items-start min-h-screen p-4 pt-20 bg-gray-100">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full flex flex-col md:flex-row gap-6">
            {/* Image Carousel Column */}
            <div className="md:w-1/2">
              <div className="group relative block overflow-hidden rounded-lg border">
                {/* Wishlist button (currently non-functional) */}
                <button className="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-gray-900/75 shadow">
                  <span className="sr-only">Wishlist</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5" // Slightly larger icon
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
                {/* Carousel */}
                {product.images && product.images.length > 0 ? (
                  <Carousel
                    showThumbs={product.images.length > 1} // Show thumbs only if multiple images
                    showStatus={false}
                    infiniteLoop
                    useKeyboardArrows
                    autoPlay
                    interval={5000} // Set interval for autoplay
                    className="product-carousel" // Add class for potential custom styling
                  >
                    {product.images.map((imageUrl, index) => (
                      <div key={index}>
                        <Image
                          src={imageUrl}
                          alt={`${product.productName} - Image ${index + 1}`}
                          width={600} // Intrinsic width
                          height={600} // Intrinsic height
                          layout="responsive" // Make image responsive
                          className="object-contain max-h-96 w-full" // Use object-contain, limit max height
                          priority={index === 0} // Prioritize loading the first image
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  // Fallback if no images
                   <div className="flex justify-center items-center h-64 bg-gray-200">
                       <p className="text-gray-500">No Image Available</p>
                   </div>
                )}
              </div>
            </div>

            {/* Product Details Column */}
            <div className="md:w-1/2 flex flex-col">
              {/* Product Name */}
              <h1 className="text-3xl font-bold mb-3 text-gray-900">
                {product.productName}
              </h1>

              {/* Brand */}
              <p className="text-md text-gray-600 mb-3">
                 Brand: <span className="font-semibold">{product.brand || 'Generic'}</span>
               </p>

              {/* Pricing */}
               <div className="mb-4">
                 <span className="text-2xl font-bold text-red-600 mr-2">
                   {product.price} {/* Assuming price includes currency symbol */}
                 </span>
                 {product.marketPrice && product.marketPrice !== product.price && (
                    <span className="text-md text-gray-500 line-through">
                      {product.marketPrice}
                    </span>
                  )}
               </div>

               {/* Stock Info */}
               <p className={`text-sm mb-4 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}
               </p>

              {/* Description */}
              <div className="mb-4">
                 <h3 className="text-lg font-semibold text-gray-800 mb-1">Description</h3>
                 <p className="text-sm text-gray-700 whitespace-pre-wrap"> {/* Preserve line breaks */}
                    {product.description || 'No description available.'}
                 </p>
              </div>

              {/* Delivery Info */}
               <p className="text-sm text-gray-700 mb-2">
                 <span className="font-semibold">Delivery:</span> {product.deliveryInfo || 'Standard Delivery'}
               </p>

               {/* Seller Info */}
               <p className="text-sm text-gray-700 mb-4">
                 <span className="font-semibold">Seller:</span> {product.seller || 'N/A'}
               </p>

               {/* EMI Info (Optional) */}
               {product.emi && (
                 <p className="text-sm text-green-700 mb-4">
                    <span className="font-semibold">EMI Options:</span> {product.emi}
                 </p>
               )}

              {/* Add to Cart Button */}
              <div className="mt-auto pt-4"> {/* Push button to bottom */}
                 <button
                    onClick={addToCart}
                    disabled={product.stock <= 0} // Disable if out of stock
                    className={`block w-full rounded p-4 text-sm font-medium transition ${
                      product.stock > 0
                        ? 'bg-yellow-400 hover:bg-yellow-500 hover:scale-105 cursor-pointer'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                 >
                   {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                 </button>
              </div>
            </div>
          </div>
        </div>
      </ProductsLayout>
    </>
  );
}
