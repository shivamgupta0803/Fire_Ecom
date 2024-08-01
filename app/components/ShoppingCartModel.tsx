// import { Dialog, Transition } from "@headlessui/react";
// import { useCartState } from "~/lib/useCart";
// import { Form, json, useLoaderData } from "@remix-run/react";
// import { Fragment, useEffect, useState } from "react";
// import { LoaderFunctionArgs } from "@remix-run/node";
// import { client } from "~/lib/sanity";
// import { urlFor } from "~/lib/sanityImageUrl";

// export async function loader({}: LoaderFunctionArgs) {
//   const query = `*[_type == 'product']{
//     price,
//     name,
//     slug,
//     "imageUrl": image[0].asset->url
//   }`;
//   const products = await client.fetch(query);
//   return json({ products });
// }



// const ShoppingCartModal = () => {
//   const data = useLoaderData();
//   const products = data?.products || [];
//   const { cart, showCart, toggleShowCart, removeFromCart, totalPrice } =
//     useCartState((state) => ({
//       cart: state.cart,
//       showCart: state.showCart,
//       toggleShowCart: state.toggleShowCart,
//       removeFromCart: state.removeFromCart,
//       totalPrice: state.totalPrice,
//     }));

//   const [latitude, setLatitude] = useState(0);
//   const [longitude, setLongitude] = useState(0);
//   useEffect(() => {
//     alert("Thank you for ordering on Fire Cracker! Visit again.");
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
//     <Transition.Root show={showCart} as={Fragment}>
//       <Dialog as="div" className="relative z-10" onClose={toggleShowCart}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-hidden">
//           <div className="absolute inset-0 overflow-hidden">
//             <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
//               <Transition.Child
//                 as={Fragment}
//                 enter="transform transition ease-in-out duration-300 sm:duration-700"
//                 enterFrom="translate-x-full"
//                 enterTo="translate-x-0"
//                 leave="transform transition ease-in-out duration-300 sm:duration-700"
//                 leaveFrom="translate-x-0"
//                 leaveTo="translate-x-full"
//               >
//                 <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
//                   <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
//                     <div className="px-4 sm:px-6">
//                       <div className="flex items-start justify-between">
//                         <Dialog.Title className="text-lg font-medium text-gray-900">
//                           Shopping Cart ({cart.length})
//                         </Dialog.Title>
//                         <div className="ml-3 flex h-7 items-center">
//                           <button
//                             type="button"
//                             className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             onClick={toggleShowCart}
//                           >
//                             <span className="sr-only">Close panel</span>
//                             <svg
//                               className="h-6 w-6"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                               aria-hidden="true"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M6 18L18 6M6 6l12 12"
//                               />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="relative mt-6 flex-1 px-4 sm:px-6">
//                       {cart.length > 0 ? (
//                         <ul>
//                           {cart.map((item) => {
//                             const product = products.find(
//                               (p: any) => p.slug === item.slug // Ensure correct matching
//                             );
//                             return (
//                               <li
//                                 key={item.id}
//                                 className="flex items-center justify-between mb-4 p-4 border border-gray-200 rounded-md"
//                               >
//                                 <div className="flex-1 flex items-center">
//                                   {product?.imageUrl && (
//                                     <img
//                                       src={product?.imageUrl[0]}
//                                       alt={item.name}
//                                       className="w-20 h-20 object-cover rounded-md mr-4"
//                                     />
//                                   )}
//                                   <div>
//                                     <div className="text-lg font-semibold text-gray-900">
//                                       {item.name}
//                                     </div>
//                                     <div className="text-gray-600">
//                                       ${item.price}
//                                     </div>
//                                     <div className="text-gray-600">
//                                       Quantity: {item.quantity}
//                                     </div>
//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         removeFromCart(item.id, item.price)
//                                       }
//                                       className="text-red-500 hover:text-red-700 mt-2"
//                                     >
//                                       Remove
//                                     </button>
//                                   </div>
//                                 </div>
//                               </li>
//                             );
//                           })}
//                         </ul>
//                       ) : (
//                         <div className="text-center text-gray-600">
//                           Your cart is empty
//                         </div>
//                       )}
//                     </div>
//                     <div className="border-t border-gray-200 px-4 sm:px-6">
//                       <div className="flex justify-between text-base font-medium text-gray-900">
//                         <p>Subtotal</p>
//                         <p>${totalPrice}</p>
//                       </div>
//                       <p className="mt-1 text-sm text-gray-500">
//                         Shipping and tax will be calculated at checkout
//                       </p>
//                     </div>
//                     <div className="px-4 sm:px-6">
//                       <Form method="post" action="/payment/success">
//                         <input
//                           type="hidden"
//                           name="cartData"
//                           value={JSON.stringify(cart)}
//                         />
//                         <input type="hidden" name="latitudeData" value={latitude}/>
//                         <input type="hidden" name="longitudeData" value={longitude}/>
//                         <input type="hidden" name="" />
//                         {cart.length > 0 ? (
//                           <button
//                             type="submit"
//                             className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors"
//                             onClick={toggleShowCart}
//                           >
//                             Checkout
//                           </button>
//                         ) : null}
//                       </Form>
//                     </div>
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   );
// };

// export default ShoppingCartModal;


import { Dialog, Transition } from "@headlessui/react";
import { useCartState } from "~/lib/useCart";
import { Form, json, useLoaderData } from "@remix-run/react";
import { Fragment, useEffect, useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { client } from "~/lib/sanity";

export async function loader({}: LoaderFunctionArgs) {
  const query = `*[_type == 'product']{
    price,
    name,
    slug,
    "imageUrl": image[0].asset->url
  }`;
  const products = await client.fetch(query);
  return json({ products });
}

// User address data
const apiEndpoint = "https://api.opencagedata.com/geocode/v1/json";
const apiKey = "f9c716176b314c70817cc133191eb466";

async function getUserCurrentAddress(latitude: number, longitude: number) {
  let query = `${latitude},${longitude}`;
  let apiUrl = `${apiEndpoint}?key=${apiKey}&q=${query}&pretty=1`;

  const res = await fetch(apiUrl);
  const data = await res.json();
  return data;
}

const ShoppingCartModal = () => {
  const data = useLoaderData();
  const products = data?.products || [];
  const { cart, showCart, toggleShowCart, removeFromCart, totalPrice } =
    useCartState((state) => ({
      cart: state.cart,
      showCart: state.showCart,
      toggleShowCart: state.toggleShowCart,
      removeFromCart: state.removeFromCart,
      totalPrice: state.totalPrice,
    }));

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState<any>(null);

  useEffect(() => {
    alert("Thank you for ordering on Fire Cracker! Visit again.");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          const addressData = await getUserCurrentAddress(latitude, longitude);
          setAddress(addressData.results[0]?.components || {});
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const formatAddress = (address: any) => {
    if (!address) return "Address not available";
    return `${address.road || "Unnamed road"}, ${address.neighbourhood || ""}, ${address.suburb || ""}, ${address.city || address.city_district || address._normalized_city || ""}, ${address.state || ""}, ${address.postcode || ""}, ${address.country || ""}`;
  };

  return (
    <Transition.Root show={showCart} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={toggleShowCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping Cart ({cart.length})
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={toggleShowCart}
                          >
                            <span className="sr-only">Close panel</span>
                            <svg
                              className="h-6 w-6"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {cart.length > 0 ? (
                        <ul>
                          {cart.map((item) => {
                            const product = products.find(
                              (p: any) => p.slug === item.slug // Ensure correct matching
                            );
                            return (
                              <li
                                key={item.id}
                                className="flex items-center justify-between mb-4 p-4 border border-gray-200 rounded-md"
                              >
                                <div className="flex-1 flex items-center">
                                  {product?.imageUrl && (
                                    <img
                                      src={product?.imageUrl[0]}
                                      alt={item.name}
                                      className="w-20 h-20 object-cover rounded-md mr-4"
                                    />
                                  )}
                                  <div>
                                    <div className="text-lg font-semibold text-gray-900">
                                      {item.name}
                                    </div>
                                    <div className="text-gray-600">
                                      ${item.price}
                                    </div>
                                    <div className="text-gray-600">
                                      Quantity: {item.quantity}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeFromCart(item.id, item.price)
                                      }
                                      className="text-red-500 hover:text-red-700 mt-2"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="text-center text-gray-600">
                          Your cart is empty
                        </div>
                      )}
                    </div>
                    <div className="border-t border-gray-200 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${totalPrice}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Shipping and tax will be calculated at checkout
                      </p>
                    </div>
                    <div className="px-4 sm:px-6">
                      <Form method="post" action="/payment/success">
                        <input
                          type="hidden"
                          name="cartData"
                          value={JSON.stringify(cart)}
                        />
                        <input
                          type="hidden"
                          name="latitudeData"
                          value={latitude}
                        />
                        <input
                          type="hidden"
                          name="longitudeData"
                          value={longitude}
                        />
                        <input
                          type="hidden"
                          name="userAddressData"
                          value={formatAddress(address)}
                        />
                        <input type="hidden" name="" />
                        {cart.length > 0 ? (
                          <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors"
                            onClick={toggleShowCart}
                          >
                            Checkout
                          </button>
                        ) : null}
                      </Form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ShoppingCartModal;
