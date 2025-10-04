import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFood_list] = useState([]);
  const url = "http://localhost:3000";  //process.env.VITE_URL;

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFood_list(response.data.data);
    } catch (err) {
      console.error("Food list fetch error:", err);
    }
  };

  const localCartData = async () => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { withCredentials: true });
      if (response.data.success) setCartItems(response.data.cartData);
    } catch (err) {
      console.error("Cart data fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFoodList();
    localCartData();
  }, []);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) setCartItems(prev => ({ ...prev, [itemId]: 1 }));
    else setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    try {
      await axios.post(`${url}/api/cart/add`, { itemId }, { withCredentials: true });
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    try {
      await axios.post(`${url}/api/cart/remove`, { itemId }, { withCredentials: true });
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
        if (cartItems[item] > 0) {
            const product = food_list.find(p => p._id === item);
            if (product) { // <-- check added
                totalAmount += product.price * cartItems[item];
            }
        }
    }
    return totalAmount;
};


  return (
    <StoreContext.Provider value={{
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      food_list,
      url
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
