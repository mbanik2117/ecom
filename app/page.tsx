import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

type Category = {
  categoryName: string;
  images: string[];
};

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

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      <Head>
        <title>shopstrider - Discover Top Deals and Categories</title>
        <meta
          name="description"
          content="Explore top categories and features on Shopstrider. Discover the best products with Genuine Products, Warranty, Fast Delivery, Best Quality, Cheapest Price, and Famous Brands."
        />
        <meta
          name="keywords"
          content="e-commerce, top categories, best products, Genuine Products, Warranty, Fast Delivery, Best Quality, Cheapest Price, Famous Brands, online shopping"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="shopstrider" />
        <meta
          property="og:title"
          content="Home - Discover Top Deals and Categories"
        />
        <meta
          property="og:description"
          content="Shop the best products with top features including warranty, fast delivery, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.shopstrider.com" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-between p-8 w-full">
        <div className="container mx-auto py-8">
          <section className="mb-8 relative z-10">
            <Link href="/allCategories">
              <div className="relative w-full h-64 cursor-pointer">
                <Image
                  src="/banner.jpg"
                  alt="Banner Image"
                  layout="fill"
                  objectFit="cover"
                  className="z-0"
                />
              </div>
            </Link>
          </section>

          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <Link href={`/categories/${category.categoryName}`} key={index}>
                  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                    <h3 className="font-bold text-black mb-2">
                      {category.categoryName}
                    </h3>
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
          </section>

          <section className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16">
              <div className="mx-auto max-w-lg text-center lg:mx-0 ltr:lg:text-left">
                <h2 className="text-3xl font-bold text-black sm:text-4xl">
                  Discover Our Top Features
                </h2>
                <p className="mt-4 text-black font-bold">
                  Enjoy shopping with the best features like Genuine Products,
                  Warranty, Fast Delivery, Best Quality, Cheapest Price, and
                  Famous Brands. We have got everything you need, all in one
                  place.
                </p>
                <a
                  href="#"
                  className="mt-8 inline-block rounded bg-indigo-600 px-12 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
                >
                  Shop Now
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
                  <span className="inline-block rounded-lg bg-gray-50 p-3">
                    <svg
                      className="size-6 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      ></path>
                    </svg>
                  </span>
                  <h2 className="mt-2 font-bold text-black">
                    Genuine Products
                  </h2>
                </div>

                <div className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
                  <span className="inline-block rounded-lg bg-gray-50 p-3">
                    <svg
                      className="size-6 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      ></path>
                    </svg>
                  </span>
                  <h2 className="mt-2 font-bold text-black">Warranty</h2>
                </div>

                <div className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
                  <span className="inline-block rounded-lg bg-gray-50 p-3">
                    <svg
                      className="size-6 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      ></path>
                    </svg>
                  </span>
                  <h2 className="mt-2 font-bold text-black">Fast Delivery</h2>
                </div>

                <div className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
                  <span className="inline-block rounded-lg bg-gray-50 p-3">
                    <svg
                      className="size-6 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      ></path>
                    </svg>
                  </span>
                  <h2 className="mt-2 font-bold text-black">Best Quality</h2>
                </div>

                <div className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
                  <span className="inline-block rounded-lg bg-gray-50 p-3">
                    <svg
                      className="size-6 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      ></path>
                    </svg>
                  </span>
                  <h2 className="mt-2 font-bold text-black">Cheapest Price</h2>
                </div>

                <div className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
                  <span className="inline-block rounded-lg bg-gray-50 p-3">
                    <svg
                      className="size-6 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      ></path>
                    </svg>
                  </span>
                  <h2 className="mt-2 font-bold text-black">Famous Brands</h2>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
