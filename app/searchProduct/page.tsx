"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';

interface Product {
  id: string;
  productName: string;
  price: number;
  images: string[]; // Array of image URLs
}

const SearchProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams?.get('search') || '';

  useEffect(() => {
    if (query) {
      searchProducts(query);
    }
  }, [query]);

  const searchProducts = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/products/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Error searching products:', await response.text());
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 text-black bg-white">
      <h2 className="font-bold mb-4">Search Results</h2>
      {loading ? (
        <p className="font-bold">Loading...</p>
      ) : (
        <div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="p-4 border rounded shadow-md hover:shadow-lg transition-shadow duration-300">
                  {product.images.length > 0 && (
                    <Image
                      src={product.images[0]} // Display only the first image
                      alt={`Product image`}
                      width={300}
                      height={300}
                      className="w-full h-auto object-cover rounded"
                    />
                  )}
                  <h3 className="text-xl font-bold mt-2">{product.productName}</h3>
                  <p className="font-bold text-lg">Price: ₹{product.price}</p>
                  <Link href={`/products/${product.id}`}>
                    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                      View Product Details
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-bold">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

const SearchProductPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SearchProduct />
  </Suspense>
);

export default SearchProductPage;
