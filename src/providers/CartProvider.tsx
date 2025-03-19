import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import { CartItem, Tables } from "@src/types";
import { useState , useEffect } from "react";
import { randomUUID } from 'expo-crypto';
import { useInsertOrder } from "@api/orders";
import { useInsertOrderItems } from "@api/order-items";
import { useRouter } from "expo-router";
import { initializePaymentSheet, openPaymentSheet } from "@lib/client/stripe";

type CartType = {
  items: CartItem[];
  addItem: (product: Tables<'products'>, size: CartItem['size']) => void;
  updateQuantity: (itemId: string, amount: 1 | -1) => void;
  total: number;
  checkout: () => void;
};

// add initial value to remove error
const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

export default function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const total = items.reduce(
    // (accumulator, item to edit)
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const router = useRouter();

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  const addItem = (product: Tables<'products'>, size: CartItem['size']) => {
    const existingItem = items.find(
      (item) => item.product.id === product.id && item.size === size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems((existingItems) => [newCartItem, ...existingItems]);
  };

  const updateQuantity = (itemId: string, amount: 1 | -1) => {
    setItems((existingItems) =>
      existingItems
        .map((it) =>
          it.id === itemId 
            ? { ...it, quantity: it.quantity + amount } : it
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const checkout = async () => {
    await initializePaymentSheet(Math.floor(total * 100));
    const paid = await openPaymentSheet();

    if (!paid) return;

    insertOrder(
      { 
        total, 
        user_id: 'blank', // automatically overriden in insertOrder
      },
      {
        onSuccess: saveOrderItems,
        onError: (error) => {
          console.error("Error inserting order:", error);
        },
      }
    );
  }

  const saveOrderItems = (order: Tables<'orders'>) => {

    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      size: cartItem.size,
    }));

    insertOrderItems(
      orderItems,
      {
        onSuccess: () => {
          clearCart(); 
          router.push('../(user)/order');
        },
        onError: (error) => {
          console.warn("Error inserting order items:", error);
        },
      }
    );
  
  }

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, total, checkout }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);