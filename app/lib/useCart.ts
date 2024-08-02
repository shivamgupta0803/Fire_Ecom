import { create } from "zustand";

interface Product {
  image: any;
  description: string;
  imageUrl: string; // Make sure this is a string, not an array
  id: string;
  name: string;
  price: number;
  quantity: number;
  slug: {
    current: string;
  };
}

interface State {
  cart: Product[];
  totalItems: number;
  totalPrice: number;
  showCart: boolean;
}

interface Actions {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string, price: number) => void;
  toggleShowCart: () => void;
}

export const useCartState = create<State & Actions>((set, get) => ({
  cart: [],
  totalItems: 0,
  totalPrice: 0,
  showCart: false,
  toggleShowCart: () => set((state) => ({ showCart: !state.showCart })),
  addToCart: (product: Product) => {
    const { cart } = get();
    const existingItemIndex = cart.findIndex(
      (item) => item.id === product.id && item.price === product.price
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;

      set((state) => ({
        ...state,
        cart: updatedCart,
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + product.price,
      }));
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];

      set((state) => ({
        ...state,
        cart: updatedCart,
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + product.price,
      }));
    }
    console.log("Cart after adding item:", get().cart);
  },
  removeFromCart: (productId: string, price: number) => {
    set((state) => {
      const itemToRemove = state.cart.find(
        (item) => item.id === productId && item.price === price
      );
      if (!itemToRemove) return state;

      if (itemToRemove.quantity > 1) {
        const updatedCart = state.cart.map((item) =>
          item.id === productId && item.price === price
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );

        return {
          ...state,
          cart: updatedCart,
          totalItems: state.totalItems - 1,
          totalPrice: state.totalPrice - price,
        };
      } else {
        return {
          ...state,
          cart: state.cart.filter(
            (item) => !(item.id === productId && item.price === price)
          ),
          totalItems: state.totalItems - 1,
          totalPrice: state.totalPrice - price,
        };
      }
    });
    console.log("Cart after removing item:", get().cart);
  },
}));
