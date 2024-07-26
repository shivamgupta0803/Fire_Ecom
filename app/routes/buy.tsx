import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { getDomainUrl, getStripeSession } from "~/lib/stripe.server";
import { sendEmailService } from "~/utils/mailer";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ message: "Method is not allowed" }, 405);
  }

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const items = values.cartData as string;

  const stripeRedirectUrl = await getStripeSession(
    items,
    getDomainUrl(request)
  );

  const itemsArray = JSON.parse(items);

  const itemListText = `
  Item Name             | Price
  ----------------------|------
  ${itemsArray.map((item: any) => 
    `${item.name.padEnd(22)} | ${item.price}`
  ).join('\n')}
  `;

  console.log("this is the data of itemNames::", itemListText);
    
  await sendEmailService('shivam.gupta@algorisys.com', 'Technical Devices List', itemListText);


  return redirect(stripeRedirectUrl);
}
