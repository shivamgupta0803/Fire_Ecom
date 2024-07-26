import Stripe from "stripe";
import { ProductId } from "./interface";

export function getDomainUrl(request: Request) {
  const host = request.headers.get("X-Forward-Host") ?? request.headers.get("host");

  if (!host) {
    throw new Error("Could not find the Url");
  }

  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export const getStripeSession = async (
  items: string,
  domainUrl: string
): Promise<string> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
    typescript: true,
  });

  const dataObj = JSON.parse(items);

  const line_items = dataObj.map((product: ProductId) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: `Product Name`,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
    adjustable_quantity: {
      enabled: true,
      minimum: 1,
      maximum: 10,
    },
  }));

  // console.log('Line items:', line_items);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: line_items,
    success_url: `${domainUrl}/payment/success`,
    cancel_url: `${domainUrl}/payment/cancelled`,
  });

  return session.url as string;
};
