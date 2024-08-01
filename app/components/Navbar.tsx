import { Link, NavLink, useMatch } from "@remix-run/react";
import { useState } from "react";
import { useCartState } from "~/lib/useCart";

const menu = [
  { title: "Userlocation", href: "/userlocation" },
  // { title: "Catégorie 1", href: "/" },
  // { title: "À propos", href: "/" },
];

const MenuLink = ({ children, href }: { children: string; href: string }) => {
  const isProduct = useMatch("/products/*");
  const forceActive = isProduct && href === "/";

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `text-primary-900 pb-1 border-b border-transparent ${
          isActive || forceActive ? "font-bold border-black" : ""
        }`
      }
    >
      {children}
    </NavLink>
  );
};

const Navbar = () => {
  const { totalItems, cartTotal, toggleShowCart } = useCartState((state) => ({
    totalItems: state.totalItems,
    cartTotal: state.totalPrice,
    toggleShowCart: state.toggleShowCart,
  }));
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-primary-200 p-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-primary-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-primary-600 hover:text-primary-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
        <Link to={"/"}>
          {" "}
          <h1 className="text-2xl font-semibold">
            Fire <span className="text-indigo-600">Crackers </span>{" "}
          </h1>{" "}
        </Link>
        <div className="hidden md:flex space-x-8">
          {menu.map((link) => (
            <MenuLink key={link.href} href={link.href}>
              {link.title}
            </MenuLink>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-2xl text-secondary-600 ">
            ${cartTotal.toFixed(2)}
          </span>
          <div className="relative">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              focusable="false"
              className="w-8 h-8 text-secondary-600 cursor-pointer"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              onClick={toggleShowCart}
            >
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0020.01 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
            </svg>
            {totalItems > 0 && (
              <div className="absolute top-[-8px] right-[-8px] h-[20px] w-[20px] p-[4px] flex items-center justify-center text-center text-xs leading-[12px] text-white bg-orange-600 rounded-[10px]">
                {totalItems}
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4">
          {menu.map((link) => (
            <div key={link.href} className="mb-2">
              <MenuLink href={link.href}>{link.title}</MenuLink>
            </div>
          ))}
        </div>
      )}
      <hr className="mt-4" />
    </header>
  );
};

export default Navbar;
