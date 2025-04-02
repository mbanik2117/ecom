// [Keep all imports and component setup as provided in the original code]
// ... (imports, type Product, component start, state, effects, etc.) ...

"use client"; // Keep if intended for Next.js App Router, otherwise remove for Pages Router

// Import 'useParams' if using App Router, 'useRouter' for Pages Router
import { useRouter } from "next/router"; // Assuming Pages Router based on file path
// If using App Router, replace the above with:
// import { useParams, useRouter } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import CategoriesLayout from "./CategoriesLayout";
import Head from "next/head"; // Correct for Pages Router. Use Metadata API for App Router.
import { db } from "@/app/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

type Product = {
  id: string;
  productName: string;
  images: string[];
  price: number;
  brand: string;
};

const CategoryPage = () => {
  const router = useRouter();
  // If using App Router:
  // const params = useParams();
  // const categoryName = params.categoryName as string; // Get categoryName from params
  // Else (Pages Router):
  const { categoryName } = router.query; // categoryName can be string | string[] | undefined

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize fetchProducts with useCallback to satisfy exhaustive-deps
  const fetchProducts = useCallback(async () => {
    // Ensure categoryName is a string before fetching
    if (typeof categoryName !== 'string' || !categoryName) {
      console.log("Category name is invalid or not yet available.");
      setProducts([]); // Clear products if category name is invalid
      setFilteredProducts([]);
      return; // Exit if categoryName is not a valid string
    }

    try {
      console.log(`Fetching products for category: ${categoryName}`); // Debug log
      const productCollection = collection(db, "products");
      const q = query(productCollection, where("category", "==", categoryName));
      const productSnapshot = await getDocs(q);

      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        // Ensure data exists and provide defaults if necessary
        productName: doc.data()?.productName ?? "No Name",
        images: doc.data()?.images ?? [],
        price: doc.data()?.price ?? 0,
        brand: doc.data()?.brand ?? "No Brand",
      }));

      console.log(`Fetched ${productList.length} products.`); // Debug log
      setProducts(productList);
      setFilteredProducts(productList); // Initialize filtered products
    } catch (error) {
      console.error("Error fetching products: ", error);
      setProducts([]); // Clear products on error
      setFilteredProducts([]);
    }
    // Add categoryName to useCallback dependency array as it's used inside
  }, [categoryName]);

  useEffect(() => {
    // Only fetch if categoryName is available (and is a string, checked in fetchProducts)
    if (categoryName) {
      fetchProducts();
    }
    // Add fetchProducts (the memoized version) to the dependency array
  }, [categoryName, fetchProducts]); // Fixed: Missing dependency 'fetchProducts'

  // Memoize filterProducts with useCallback
  const filterProducts = useCallback(() => {
    let filtered = products;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // NOTE: Price filtering logic would go here if minPrice/maxPrice were used

    setFilteredProducts(filtered);
    // Add dependencies: products and searchQuery
  }, [products, searchQuery]);

  useEffect(() => {
    filterProducts();
    // Add filterProducts (the memoized version) to the dependency array
    // Dependencies removed: minPrice, maxPrice
  }, [searchQuery, filterProducts, products]); // Added 'products' as filterProducts depends on it indirectly. Run filter when products load initially. Fixed: Missing dependency 'filterProducts'

  const handleSearch = () => {
    // Use router.push for navigation to a global search page
    router.push(`/searchProduct?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger global search on Enter
      // If you wanted to trigger *local* filtering on Enter instead/as well:
      // filterProducts(); // No need, filterProducts runs via useEffect on searchQuery change
    }
  };

  // Ensure categoryName is a string for display purposes
  const displayCategoryName = Array.isArray(categoryName) ? categoryName[0] : categoryName;
  const pageTitle = displayCategoryName
    ? `${displayCategoryName} - Category Page`
    : "Category Page";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Explore a wide range of products in the ${displayCategoryName || ""} category. Find the best deals and offers on your favorite products.`}
        />
        <meta
          name="keywords"
          content={`e-commerce, ${displayCategoryName || ""}, buy online, best prices, special offers`}
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <CategoriesLayout>
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-8"> {/* Added mb-8 */}
              <h2 className="text-xl font-bold text-black sm:text-3xl mb-4 sm:mb-0"> {/* Added mb-4 for mobile */}
                {displayCategoryName ? `${displayCategoryName} Collection` : 'Product Collection'} {/* Dynamic Title */}
              </h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search in this category..." // Updated placeholder
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress} // Keep this for Enter key search (global)
                  className="px-4 py-2 border rounded-md text-black font-bold w-full sm:w-auto" // Responsive width
                />
                {/* Optional: Add a button to explicitly trigger the global search if needed */}
                {/* <button onClick={handleSearch} className="...">Global Search</button> */}
              </div>
            </header>

            {/* Conditional Rendering for Loading/No Products */}
            {filteredProducts.length === 0 && products.length > 0 && searchQuery && (
                 <p className="text-center text-gray-500 mt-8">No products match your search in this category.</p>
            )}

            {/* Condition to show when initially loading or category has no products */}
            {products.length === 0 && !searchQuery && (
                 <p className="text-center text-gray-500 mt-8">
                    {/* You might want a loading state check here */}
                    {typeof categoryName === 'string' ? `Loading products for ${displayCategoryName}...` : 'Loading category...'}
                 </p>
            )}
             {filteredProducts.length === 0 && products.length === 0 && !searchQuery && typeof categoryName === 'string' && (
                  <p className="text-center text-gray-500 mt-8">No products found in the {displayCategoryName} category.</p>
             )}


            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group block overflow-hidden border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200" // Base styling on the outer div
                >
                  {/* --- FIX STARTS HERE --- */}
                  {/* Remove legacyBehavior and the explicit <a> tag */}
                  {/* Apply link behavior directly, make it block to fill the container */}
                  <Link href={`/products/${product.id}`} className="block cursor-pointer">
                      {/* Wrap the multiple children in a single fragment or div if needed for styling */}
                      {/* Fragment is usually fine if no extra wrapper element is required */}
                      <>
                        <div className="relative h-[200px] sm:h-[250px] mb-3"> {/* Image container */}
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]} // Display the first image
                              alt={product.productName}
                              layout="fill" // Use fill and relative parent
                              objectFit="contain" // Ensures the image fits within the box without stretching
                              className="w-full h-full object-contain group-hover:opacity-90 transition-opacity duration-200" // Slight hover effect
                              priority={false} // Avoid prioritizing too many images initially
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div> // Placeholder
                          )}
                        </div>
                        <div> {/* Text content container */}
                          <h3 className="text-base text-black font-semibold mb-1 truncate group-hover:text-blue-600 transition-colors"> {/* Adjusted size, added truncate & hover effect */}
                            {product.productName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{product.brand}</p> {/* Added brand display */}
                          <p className="text-lg text-black font-bold"> {/* Adjusted size */}
                            Rs {product.price.toLocaleString()} {/* Format price */}
                          </p>
                        </div>
                      </>
                  </Link>
                   {/* --- FIX ENDS HERE --- */}
                </div>
              ))}
            </div>
          </div>
        </section>
      </CategoriesLayout>
    </>
  );
};

export default CategoryPage;

