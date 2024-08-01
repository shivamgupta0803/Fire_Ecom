import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { getDomainUrl, getStripeSession } from "~/lib/stripe.server";
import { sendEmailService } from "~/utils/mailer";

export const loader = async () => {
  // Fetch data or perform any required actions
  return json({ message: "Hello from the loader!" });
};

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ message: "Method is not allowed" }, 405);
  }

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const items = values.cartData as string;

  // const stripeRedirectUrl = await getStripeSession(
  //   items,
  //   getDomainUrl(request)
  // );

  const itemsArray = JSON.parse(items);

  const itemListText = `
  <h1> Fire Product List </h1>
  <table border="1" cellpadding="5" cellspacing="0">
    <thead>
      <tr>
        <th>Item Name</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      ${itemsArray
        .map(
          (item: any) => `
            <tr>
              <td>${item.name}</td>
              <td>₹${item.price}</td>
            </tr>`
        )
        // <p>${totalPrice}</p>
        .join("")}
    </tbody>
  </table>
`;

  // console.log("this is the data of itemNames::", itemListText);

  await sendEmailService(
    "shivam.gupta@algorisys.com",
    "Technical Devices List",
    itemListText
  );


  return redirect("/payment/success") && json({ success: true });
}
