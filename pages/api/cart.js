import prisma from "../../lib/prisma";
import { dbAdmin, authAdmin } from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    const { productId, idToken } = req.body;

    if (!idToken) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    try {
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const productDocRef = dbAdmin.collection("products").doc(productId);
      const productSnap = await productDocRef.get();
      if (!productSnap.exists) {
        return res.status(404).send({ message: "Product not found" });
      }

      let cart = await prisma.cart.findFirst({ where: { userId: userId } });
      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: userId,
            products: [],
            totalCartValue: 0,
          },
        });
      }

      const products = cart.products || [];
      const existingProductIndex = products.findIndex(
        (p) => p.productId === productId,
      );

      if (existingProductIndex >= 0) {
        products[existingProductIndex].quantity++;
      } else {
        products.push({
          productId: productId,
          quantity: 1,
        });
      }

      const productDetails = await Promise.all(
        products.map(async (item) => {
          const productDocRef = dbAdmin
            .collection("products")
            .doc(item.productId);
          const productSnap = await productDocRef.get();
          return { ...item, price: productSnap.data().price };
        }),
      );

      const totalCartValue = productDetails.reduce(
        (total, item) => total + item.quantity * parseFloat(item.price),
        0,
      );

      const updatedCart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          products: products,
          totalCartValue: totalCartValue,
        },
      });

      res
        .status(200)
        .send({
          message: "Product added to cart successfully",
          cart: updatedCart,
        });
    } catch (error) {
      console.error("Error adding to cart:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (method === "GET") {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    try {
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const cart = await prisma.cart.findFirst({ where: { userId: userId } });
      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      }

      return res.status(200).json(cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (method === "DELETE") {
    const { productId, idToken } = req.body;

    if (!idToken) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    try {
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const cart = await prisma.cart.findFirst({ where: { userId: userId } });
      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      }

      const products = cart.products.filter(
        (product) => product.productId !== productId,
      );

      const productDetails = await Promise.all(
        products.map(async (item) => {
          const productDocRef = dbAdmin
            .collection("products")
            .doc(item.productId);
          const productSnap = await productDocRef.get();
          return { ...item, price: productSnap.data().price };
        }),
      );

      const totalCartValue = productDetails.reduce(
        (total, item) => total + item.quantity * parseFloat(item.price),
        0,
      );

      const updatedCart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          products: products,
          totalCartValue: totalCartValue,
        },
      });

      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error("Error removing from cart:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (method === "PUT") {
    const { productId, quantity, idToken } = req.body;

    if (!idToken) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    try {
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const cart = await prisma.cart.findFirst({ where: { userId: userId } });
      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      }

      const products = cart.products.map((product) =>
        product.productId === productId ? { ...product, quantity } : product,
      );

      const productDetails = await Promise.all(
        products.map(async (item) => {
          const productDocRef = dbAdmin
            .collection("products")
            .doc(item.productId);
          const productSnap = await productDocRef.get();
          return { ...item, price: productSnap.data().price };
        }),
      );

      const totalCartValue = productDetails.reduce(
        (total, item) => total + item.quantity * parseFloat(item.price),
        0,
      );

      const updatedCart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          products: products,
          totalCartValue: totalCartValue,
        },
      });

      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error("Error updating cart:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.setHeader("Allow", ["POST", "GET", "DELETE", "PUT"]);
}
