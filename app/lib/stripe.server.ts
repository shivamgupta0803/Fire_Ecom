import Stripe from "stripe";

interface ProductId {
  slugProductId: string;
  quantity: number;
}

export function getDomainUrl(request: Request) {
  const host = request.headers.get("X-Forward-Host") ?? request.headers.get("host");

  if (!host) {
    throw new Error("Could not find the Url");
  }

  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

const secret_key = process.env.STRIPE_SECRET_KEY as string;

export const getStripeSession = async (
  items: ProductId[],
  domainUrl: string
): Promise<string> => {
  const stripe = new Stripe(secret_key, {
    apiVersion: "2024-06-20",
    typescript: true,
  });

  const line_items = items.map((product) => ({
    price: product.slugProductId,
    quantity: product.quantity,
    adjustable_quantity: {
      enabled: true,
      minimum: 1,
      maximum: 10,
    },
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items,
    success_url: `${domainUrl}/payment/success`,
    cancel_url: `${domainUrl}/payment/cancelled`,
  });

  return session.url as string;
};
