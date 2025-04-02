"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { z } from "zod";

// Define Zod schema for form validation
const formSchema = z.object({
  customerName: z.string().min(1, { message: "Customer name is required" }),
  apartment: z.string().min(1, { message: "Apartment is required" }),
  block: z.string().min(1, { message: "Block is required" }),
  locality: z.string().min(1, { message: "Locality is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  pincode: z.string().regex(/^\d{6}$/, { message: "Pincode must be 6 digits" }),
  email: z.string().email({ message: "Invalid email address" }),
  mobile: z
    .string()
    .regex(/^\d{10}$/, { message: "Mobile number must be 10 digits" }),
  paymentMethod: z.enum(["cash-on-delivery", "online-payment"], {
    message: "Payment method is required",
  }),
});

type FormFields = z.infer<typeof formSchema>;

export default function Checkout() {
  const [form, setForm] = useState<FormFields>({
    customerName: "",
    apartment: "",
    block: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    mobile: "",
    paymentMethod: "cash-on-delivery", // Default to cash-on-delivery
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormFields, string>>
  >({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = formSchema.safeParse(form);

      if (!result.success) {
        const fieldErrors = result.error.format();
        setErrors({
          customerName: fieldErrors.customerName?._errors[0] || "",
          apartment: fieldErrors.apartment?._errors[0] || "",
          block: fieldErrors.block?._errors[0] || "",
          locality: fieldErrors.locality?._errors[0] || "",
          city: fieldErrors.city?._errors[0] || "",
          state: fieldErrors.state?._errors[0] || "",
          pincode: fieldErrors.pincode?._errors[0] || "",
          email: fieldErrors.email?._errors[0] || "",
          mobile: fieldErrors.mobile?._errors[0] || "",
          paymentMethod: fieldErrors.paymentMethod?._errors[0] || "",
        });
        return;
      }

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not authenticated");
      }

      if (form.paymentMethod === "online-payment") {
        // Initiate PhonePe payment request
        const paymentResponse = await axios.post("/api/payment/initiate", {
          ...form,
          idToken: await user.getIdToken(true),
        });

        const { redirectUrl } = paymentResponse.data;
        window.location.href = redirectUrl; // Redirect user to PhonePe payment page
      } else {
        // Handle cash-on-delivery order creation
        await axios.post("/api/Order/create", {
          ...form,
          idToken: await user.getIdToken(true),
        });

        router.push(`/Order`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(form).map(
          (key) =>
            key !== "paymentMethod" && (
              <div key={key} className="mb-4">
                <label
                  className="block text-black text-sm font-bold mb-2"
                  htmlFor={key}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  name={key}
                  value={form[key as keyof FormFields]}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors[key as keyof FormFields] && (
                  <p className="text-red-500 text-xs italic">
                    {errors[key as keyof FormFields]}
                  </p>
                )}
              </div>
            ),
        )}

        <div className="mb-4">
          <label className="block text-black text-sm font-bold mb-2">
            Payment Method
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="paymentMethod"
              value="cash-on-delivery"
              checked={form.paymentMethod === "cash-on-delivery"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2 text-black font-bold">Cash on Delivery</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="online-payment"
              checked={form.paymentMethod === "online-payment"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2 text-black font-bold">Online Payment</span>
          </label>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
