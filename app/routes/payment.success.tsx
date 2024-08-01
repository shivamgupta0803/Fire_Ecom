// import { ActionFunctionArgs } from "@remix-run/node";
// import { json, Link, redirect } from "@remix-run/react";
// import { useEffect, useState } from "react";
// import { sendEmailService } from "~/utils/mailer";

// const PaymentSuccess = () => {
//   const [latitude, setLatitude] = useState(0);
//   const [longitude, setLongitude] = useState(0);

//   useEffect(() => {
//     alert("thank you for order on fire cracker! visit again");
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLatitude(latitude);
//           setLongitude(longitude);
//         },
//         (error) => {
//           console.log("Geolocation error:", error);
//         }
//       );
//     } else {
//       console.log("Geolocation is not supported by this browser.");
//     }
//   }, []);
//   return (
//     <>
//       <div className="h-[90vh] flex flex-col items-center justify-center overflow-hidden w-full">
//         <div className="bg-white p-6 mg:mx-auto">
//           <div className="test-center">
//             <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
//               Your order was successful
//             </h3>
//             <p className="text-gray-600 my-2">
//               Thank you for your order, payment was successful
//             </p>
//             <p className="text-center">Have a good day!</p>
//             <div className="py-10 text-center">
//               <Link
//                 to={"/"}
//                 className="px-12 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold py-3"
//               >
//                 Go to homepage
//               </Link>
//             </div>
//           </div>
//           {latitude && longitude && (
//             <div className="result w-full max-w-md bg-white p-6 mt-4 rounded-lg shadow-md">
//               <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
//                 Your Coordinates
//               </h2>
//               <div className="mb-4">
//                 <strong className="block text-gray-700">Latitude:</strong>
//                 <span className="text-gray-900">{latitude}</span>
//               </div>
//               <div className="mb-4">
//                 <strong className="block text-gray-700">Longitude:</strong>
//                 <span className="text-gray-900">{longitude}</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export async function action({ request }: ActionFunctionArgs) {
//   const formData = await request.formData();
//   const values = Object.fromEntries(formData);

//   const items = values.cartData as string;
//   const itemsArray = JSON.parse(items);

//   const itemListText = `
//   <h1> Fire Product List </h1>
//   <table border="1" cellpadding="5" cellspacing="0">
//     <thead>
//       <tr>
//         <th>Item Name</th>
//         <th>Price</th>
//       </tr>
//     </thead>
//     <tbody>
//       ${itemsArray
//         .map(
//           (item: any) => `
//             <tr>
//               <td>${item.name}</td>
//               <td>₹${item.price}</td>
//             </tr>
//                <tr>
//               <td>${latitude}</td>
//               <td>₹${longitude}</td>
//             </tr>
//             `
//         )
//         .join("")}
//     </tbody>
//   </table>
//         <div className="result w-full max-w-md bg-white p-6 mt-4 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
//             Your Coordinates
//           </h2>
//           <div className="mb-4">
//           </div>
//           <div className="mb-4">{longitude}
//           </div>
//         </div>
//       )}
// `;

//   await sendEmailService(
//     "shivam.gupta@algorisys.com",
//     "Technical Devices List",
//     itemListText
//   );

//   return redirect("/payment/success");
// }

// export default PaymentSuccess;

import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";

const PaymentSuccess = () => {
  useEffect(
    () => {
      alert("Thank you for ordering on Fire Cracker! Visit again.");
    },
    [redirect("/payment/success")]
  );
  return (
    <>
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
    </>
  );
};

import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { sendEmailService } from "~/utils/mailer";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const items = values.cartData as string;
  const latitude = values.latitudeData as string;
  const longitude = values.longitudeData as string;
  const userAddressData = values.userAddressData as string;

  console.log("this is the value of userAddressData::", userAddressData);
  // console.log("this is the value of itemsArray ::", longitude);
  const itemsArray = JSON.parse(items);

  const itemListText = `
  <h1 style="font-family: Arial, sans-serif; color: #333;">🔥 Fire Product List</h1>
  <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
    <thead>
      <tr>
        <th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Item Name</th>
        <th style="background-color: #f2f2f2; padding: 10px; text-align: left;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${itemsArray
        .map(
          (item: any) => `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">₹${item.price}</td>
            </tr>`
        )
        .join("")}
    </tbody>
  </table>
  <h2 style="font-family: Arial, sans-serif; color: #333; margin-top: 20px;">📍 User Address</h2>
  <p style="font-family: Arial, sans-serif; color: #666; line-height: 1.5;">
    ${userAddressData},<br>
  </p>
`;
  await sendEmailService(
    "shivam.gupta@algorisys.com",
    "Technical Devices List",
    itemListText
  );

  return redirect("/payment/success");
}

export default PaymentSuccess;
