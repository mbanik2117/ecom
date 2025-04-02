"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

type CartProduct = {
  productId: string;
  quantity: number;
  productName: string;
  price: number;
  images: string[];
  size?: string;
  color?: string;
};

type Cart = {
  products: CartProduct[];
  totalCartValue: number;
};

export default function Cart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch cart for the authenticated user
  const fetchCart = async (user: User) => {
    setLoading(true);
    try {
      const idToken = await user.getIdToken(true);
      const response = await axios.get(`/api/cart`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const cartData = response.data;

      const productDetailsPromises = cartData.products.map(
        async (product: CartProduct) => {
          const productDoc = doc(db, "products", product.productId);
          const productSnap = await getDoc(productDoc);
          return productSnap.exists()
            ? {
                ...product,
                ...(productSnap.data() as Partial<CartProduct>),
              }
            : null;
        }
      );

      const productsWithDetails = (
        await Promise.all(productDetailsPromises)
      ).filter(Boolean) as CartProduct[];

      const totalCartValue = productsWithDetails.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      setCart({
        products: productsWithDetails,
        totalCartValue,
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        fetchCart(currentUser);
      } else {
        console.log("User not authenticated");
        router.push("/login");
      }
    });
  
    return () => unsubscribe();
  }, [router]);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const idToken = currentUser ? await currentUser.getIdToken(true) : null;

      await axios.delete(`/api/cart`, {
        data: {
          productId,
          idToken,
        },
      });

      setCart((prevCart) => {
        if (!prevCart) return prevCart;

        const updatedProducts = prevCart.products.filter(
          (product) => product.productId !== productId
        );

        const totalCartValue = updatedProducts.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        );

        return {
          ...prevCart,
          products: updatedProducts,
          totalCartValue,
        };
      });
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const idToken = currentUser ? await currentUser.getIdToken(true) : null;

      await axios.put(
        `/api/cart`,
        {
          productId,
          quantity,
          idToken,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      setCart((prevCart) => {
        if (!prevCart) return prevCart;

        const updatedProducts = prevCart.products.map((product) =>
          product.productId === productId ? { ...product, quantity } : product
        );

        const totalCartValue = updatedProducts.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        );

        return {
          ...prevCart,
          products: updatedProducts,
          totalCartValue,
        };
      });
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const total = cart ? cart.totalCartValue : 0;

  if (loading) {
    return <div className="font-bold text-black">Loading...</div>;
  }

  if (!cart || cart.products.length === 0) {
    return (
      <div className="font-bold text-black text-center mt-8">
        Your cart is empty
      </div>
    );
  }

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Your Cart
            </h1>
          </header>

          <div className="mt-8">
            <ul className="space-y-4">
              {cart.products.map((product) => (
                <li key={product.productId} className="flex items-center gap-4">
                  {product.images && product.images.length > 0 ? (
                    <div className="w-24 h-24 relative">
                      <Image
                        src={product.images[0]}
                        alt={product.productName}
                        layout="fill"
                        objectFit="contain"
                        className="rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded"></div>
                  )}

                  <div className="flex-grow">
                    <h3 className="text-sm text-gray-900">
                      {product.productName}
                    </h3>
                    <h3 className="text-sm text-gray-900">
                      Rs {product.price}
                    </h3>
                  </div>

                  <div className="flex flex-1 items-center justify-end gap-2">
                    <div className="flex items-center">
                      <button
                        className="px-2 py-1 bg-gray-200 text-black font-bold rounded"
                        onClick={() =>
                          handleUpdateQuantity(
                            product.productId,
                            product.quantity - 1
                          )
                        }
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2 font-bold text-black">
                        {product.quantity}
                      </span>
                      <button
                        className="px-2 py-1 bg-gray-200 text-black font-bold rounded"
                        onClick={() =>
                          handleUpdateQuantity(
                            product.productId,
                            product.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="text-gray-600 transition hover:text-red-600"
                      onClick={() => handleRemoveFromCart(product.productId)}
                    >
                      <span className="sr-only">Remove item</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
              <div className="w-full max-w-lg space-y-4">
                <dl className="space-y-0.5 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <dt>Total</dt>
                    <dd>Rs {total.toFixed(2)}</dd>
                  </div>
                </dl>

                <div className="flex justify-end">
                  <button
                    className="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
