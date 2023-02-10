import { createContext, ReactNode, useContext, useState } from 'react';
import { ShoppingCart } from '../components/ShoppingCart';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * types
 */
type ShoppingCartContextProviderPropsType = {
  children: ReactNode;
};

type CartItemType = {
  id: number;
  quantity: number;
};

type ShoppingCartContextProviderValueType = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItemType[];
};

/**
 * ShoppingCartContext
 */
// 기본값을 빈 오브젝트 {}로 넣어주기위해
// ShoppingCartContextProviderValueType로 지정 as
const ShoppingCartContext = createContext(
  {} as ShoppingCartContextProviderValueType
);

/**
 * useShoppingCart
 */
export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

/**
 * ShoppingCartContextProvider
 */
export function ShoppingCartContextProvider({
  children,
}: ShoppingCartContextProviderPropsType) {
  //
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useLocalStorage<CartItemType[]>(
    'shopping-cart',
    []
  );

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }
  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      //
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      }
      //
      else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      //
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      }
      //
      else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function removeFromCart(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
