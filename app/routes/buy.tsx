import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { LoaderFunction } from "@remix-run/node";
import { getDomainUrl, getStripeSession } from "~/lib/stripe.server";

interface ProductId {
  slugProductId: string;
  quantity: number;
}

// Loader function to handle GET requests
export const loader: LoaderFunction = async () => {
  return json({ message: "GET request not allowed" }, 405);
};

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ message: "Method is not allowed" }, 405);
  }

  try {
    const formData = await request.formData();
    const cartData = formData.get("cartData");

    if (!cartData) {
      throw new Error("Cart data is missing");
    }

    // Parse cartData into an array of objects
    let items: any[];
    try {
      items = JSON.parse(cartData as string);
    } catch (error) {
      console.error("Error parsing cart data:", error);
      throw new Error("Cart data is not valid JSON");
    }
    
    const productIds: ProductId[] = items.map(item => ({
      slugProductId: item.slug,
      quantity: item.quantity,
    }));

    if (!Array.isArray(productIds) || productIds.some(item => typeof item.slugProductId !== 'string' || typeof item.quantity !== 'number')) {
      console.error("Invalid cart data structure:", productIds);
      throw new Error("Invalid cart data structure");
    }

    const stripeRedirectUrl = await getStripeSession(productIds, getDomainUrl(request));

    return redirect(stripeRedirectUrl);
  } catch (error) {
    console.error("Error creating Stripe session:", error.message);
    return json({ message: "Error creating Stripe session", error: error.message }, 500);
  }
}
