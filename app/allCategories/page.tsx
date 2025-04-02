import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

type Category = {
  categoryName: string;
  images: string[];
};

// Fetch categories from the database
async function getCategories() {
  try {
    const categoryCollection = collection(db, "categories");
    const categorySnapshot = await getDocs(categoryCollection);
    const categories = categorySnapshot.docs.map(
      (doc) => doc.data() as Category
    );
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function AllCategories() {
  const categories = await getCategories();

  return (
    <>
      <Head>
        <title>All Categories - Explore Our Product Collection</title>
        <meta
          name="description"
          content="Browse our extensive range of product categories. Find top-quality products from trusted brands with fast delivery, competitive pricing, and excellent service."
        />
        <meta
          name="keywords"
          content="categories, products, online shopping, top brands, best quality, fast delivery, affordable pricing"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="All Categories - Explore Our Product Collection" />
        <meta
          property="og:description"
          content="Discover a wide variety of products in our categories. Shop from trusted brands with ease and convenience."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.shopstrider.com/allCategories" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:title"
          content="All Categories - Explore Our Product Collection"
        />
        <meta
          property="twitter:description"
          content="Shop top-quality products across various categories with excellent features like fast delivery and affordable pricing."
        />
      </Head>

      <main className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">All Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link href={`/categories/${category.categoryName}`} key={index}>
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                <h3 className="font-bold text-black mb-2">{category.categoryName}</h3>
                {category.images.map((image, imgIndex) => (
                  <Image
                    key={imgIndex}
                    src={image}
                    alt={`${category.categoryName} image ${imgIndex + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-24 object-cover bg-gray-200 rounded-md"
                  />
                ))}
                <button className="mt-2 text-black font-bold">
                  {category.categoryName}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
