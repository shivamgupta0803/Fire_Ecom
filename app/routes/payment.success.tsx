import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { sendEmailService } from "~/utils/mailer";

const PaymentSuccess = () => {
  useEffect(() => {
    alert("Thank you for ordering on Fire Cracker! Visit again.");
  }, []);

  return (
    <div className="h-[90vh] flex flex-col items-center justify-center overflow-hidden w-full">
      <div className="bg-white p-6 mg:mx-auto">
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold">
            Your order was successful
          </h3>
          <p className="text-gray-600 my-2">
            Thank you for your order, payment was successful.
          </p>
          <p className="text-center">Have a good day!</p>
          <div className="py-10 text-center">
            <Link
              to="/"
              className="px-12 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold py-3"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const items = values.cartData as string;
  const userAddressData = values.userAddressData as string;
  const totalPrice = parseFloat(values.totalPrice as string);

  const itemsArray = JSON.parse(items);

  const itemListText = `
  <h1 style="font-family: Arial, sans-serif; color: #333;">🔥 Fire Product List</h1>
  <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
    <thead>
      <tr>
        <th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Item Name</th>
        <th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Price</th>
        <th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Quantity</th>
        <th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Image</th>
        <th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemsArray
        .map(
          (item: any) => `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">${
                item.name
              }</td>
              <td style="padding: 10px; border: 1px solid #ddd;">₹${
                item.price
              }</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${
                item.quantity
              }</td>
              <td style="padding: 10px; border: 1px solid #ddd;"><img src="${
                item.images[0]
              }" alt="${item.name}" style="max-width: 100px;" /></td>
              <td style="padding: 10px; border: 1px solid #ddd;">₹${(
                item.price * item.quantity
              ).toFixed(2)}</td>
            </tr>`
        )
        .join("")}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">₹${totalPrice.toFixed(2)}</td>
      </tr>
    </tfoot>
  </table>

  <h2 style="font-family: Arial, sans-serif; color: #333; margin-top: 20px;">📍 User Address</h2>
  <p style="font-family: Arial, sans-serif; color: #666; line-height: 1.5;">
    ${userAddressData},<br>
  </p>
`;

  // Define the recipients array
  const recipients = ["bloggieapp@gmail.com", "sundaram6060@gmail.com",];

  // Adding a delay before sending the email
  setTimeout(async () => {
    await sendEmailService(
      recipients,
      "Diwali Fire Product List",
      itemListText
    );
  }, 2000); // Delay time in milliseconds (e.g., 2000ms = 2 seconds)

  return redirect("/payment/success");
}



export default PaymentSuccess;
