import { Dialog, Transition } from "@headlessui/react";
import { useCartState } from "~/lib/useCart";
import { Form, useLoaderData } from "@remix-run/react";
import { Fragment } from "react/jsx-runtime";
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
  return { products };
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

  return (
    <Transition.Root show={showCart} as={Fragment}>
      <Dialog onClose={toggleShowCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="flex items-center justify-center h-screen">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="relative max-w-md w-full mx-auto mt-24 bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="px-6 py-4 sm:px-8">
                  <div className="flex items-start justify-between">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      Shopping Cart
                    </Dialog.Title>
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-500"
                      onClick={toggleShowCart}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
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
                  <div className="mt-4">
                    {cart.length > 0 ? (
                      cart.map((item) => {
                        const product = products.find(
                          (p: any) => p.slug.current === item.slug
                        );
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between mb-4"
                          >
                            <div className="flex-1 ml-4">
                              <div className="text-lg font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-gray-500">${item.price}</div>
                              <div className="text-gray-500">
                                Quantity: {item.quantity}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart(item.id, item.price)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                            {product?.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={item.name}
                                className="w-16 h-16 object-cover"
                              />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center">Your cart is empty</div>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-4 sm:px-8">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${totalPrice}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Shipping and tax will be calculated at checkout
                  </p>
                </div>
                <div className="px-6 py-4 sm:px-8">
                  <Form method="post" action="/buy">
                    <input
                      type="hidden"
                      name="cartData"
                      value={JSON.stringify(cart)}
                    />
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md text-base font-medium hover:bg-indigo-700"
                      onClick={toggleShowCart}
                    >
                      Checkout
                    </button>
                  </Form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ShoppingCartModal;
