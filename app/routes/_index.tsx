import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { useEffect } from "react";
import { create } from "zustand";
import { Product } from "~/lib/interface";
import { client } from "~/lib/sanity";

interface iAppProps {
  products: Product[];
}

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

const useCartStore = create((set) => ({
  cartItems: [],
  clearCart: () => set({ cartItems: [] }),
}));

const IndexPage = () => {
  const { products } = useLoaderData<iAppProps>();
  const location = useLocation();
  const clearCart = useCartStore((state: any) => state.clearCart);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("clearCache") === "true") {
      clearCart();
    }
  }, [location, clearCart]);

  return (
    <>
      <section
        className="flex flex-col justify-between gap-6 sm:gap-10 md:gap-16 lg:flex-row mt-2"
        id="top"
      >
        <div className="flex flex-col justify-center sm:text-center lg-py-12 lg:text-left xl:w-5/12 xl:py-24">
          <p className="font-semibold text-yellow-500 md:mb-2 md:text-lg xl:text-xl">
            Step into the Sparkle!
          </p>
          <h1 className="text-black mb-2 text-4xl font-bold sm:text-5xl md:mb-12 md:text-6xl ">
            Ignite Your Tech Passion
          </h1>
          <p className="mb-8 leading-relaxed text-gray-500 md:mb-12 lg:w-4/5 xl:text-lg">
            Welcome to TechConnect, where innovation meets excitement! Discover
            the latest gadgets and accessories that will light up your world
            with a burst of technology and creativity.
          </p>
          <div className="">
            <Link
              to={"#products"}
              className="rounded-lg bg-yellow-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-yellow-300 transition duration-100 md:text-base"
            >
              Explore Now
            </Link>
          </div>
        </div>
        <div className="h-48 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:h-auto xl:w-5/12">
          <img
            src="https://media.istockphoto.com/id/1339303464/vector/happy-diwali-hindu-festival-banner-greeting-card-burning-diya-illustration-background-for.jpg?s=612x612&w=0&k=20&c=2e1R4zw3Ze-vt1e6jl9oWWe9fcElWmi1M9M382wwdu4="
            alt="Product Image"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </section>

      <section id="products" className="py-24 sm:py-32 lg:pt-32">
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 md:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
          {products.map((product) =>
            product.slug?.current ? (
              <Link
                key={product.slug.current}
                to={`/product/${product.slug.current}`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-full h-56 rounded-md overflow-hidden group-hover:opacity-75 lg:h-72 xl:h-80">
                    <img
                      src={product.imageUrl}
                      alt="Image of Product"
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-2xl text-gray-700">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-2xl font-medium text-gray-900">
                    ₹ {product.price}
                  </p>
                </div>
              </Link>
            ) : null
          )}
        </div>
      </section>

      <footer className="mb-4">
        <h1 className="text-center text-yellow-500">
          Celebrating Innovation with Shivam Gupta &copy;{" "}
          <Link to={"#top"}>
            <i className="bi bi-arrow-up text-3xl"></i>
          </Link>
        </h1>
      </footer>
    </>
  );
};

export default IndexPage;
