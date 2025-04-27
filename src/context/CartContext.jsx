// context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, updateCartByIdKH } from '../services/cartAPI';
import { message } from 'antd';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const cartId = localStorage.getItem('cartId');


  const updateCart = (newCart) => setCart(newCart);

  const fetchCart = async () => {
    if (cartId) {
      try {
        const res = await getCart(cartId);
        if (res && res.data) {
          setCart(res.data);
        }
      } catch (error) {
        console.error('Lỗi khi load giỏ hàng:', error);
      }
    }
  };

  const updateItemQuantity = async (idSP, quantity) => {
      try {          
            const response = await updateCartByIdKH(cartId, idSP, quantity)
            message.success('Đã cập nhật số lượng và tổng tiền')
            await fetchCart();
      } catch (error) {
          console.error('Lỗi cập nhật số lượng:', error);
      }
  };


  useEffect(() => {
    if (cartId) {
      fetchCart();
    } else {
      fetchCart();
    }
  }, [cartId]);
  

  return (
    <CartContext.Provider value={{ cart, updateCart, fetchCart, updateItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);