import prisma from '@/../../lib/prisma';
import { authAdmin } from '@/../../lib/firebaseAdmin'; // Use the initialized Firebase Admin
import { sendOrderEmail } from '@/../../emailservice';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    customerName,
    apartment,
    block,
    locality,
    city,
    state,
    pincode,
    email,
    mobile,
    idToken,
  } = req.body;

  try {
    // Use initialized authAdmin instead of getAuth()
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Fetch cart items
    const cart = await prisma.cart.findFirst({
      where: { userId: userId },
    });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const order = await prisma.customerOrder.create({
      data: {
        userId: userId,
        customerName: customerName,
        apartment: apartment,
        block: block,
        locality: locality,
        city: city,
        state: state,
        pincode: pincode,
        email: email,
        mobile: mobile,
        orderTotal: cart.totalCartValue,
        orderItems: cart.products,
        orderNumber: orderNumber,
        seller: '',
        quantity: cart.products.reduce(
          (acc, product) => acc + product.quantity,
          0
        ),
        amount: cart.totalCartValue,
        providerReferenceId: '',
        merchantId: '',
        transactionId: '',
        providerId: '',
        responseCode: '',
      },
    });

    // Clear the cart
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        products: [],
        totalCartValue: 0,
        isPaid: false,
      },
    });

    // Prepare the order details for the email
    const orderDetails = {
      customerName,
      email,
      products: cart.products,
      total: cart.totalCartValue,
      orderNumber,
      idToken, // Include the ID token when sending the email
    };

    // Send the order email
    await sendOrderEmail(orderDetails); // Send email to the user

    res.status(200).json({ orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
