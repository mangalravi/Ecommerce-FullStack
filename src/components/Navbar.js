import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProductsData } from "../store/slices/ProductSlice";
import { fetchCartItemsData } from "../store/slices/CartSlice";
const Navbar = () => {
  const cartItems = useSelector((state) => state.cartItems.list);
  const TotalCartItems = cartItems.reduce(
    (total, item) => total + item.quanity,
    0
  );
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(
    //   fetchData(
    //     [
    //     {
    //       url: "products",
    //       onSuccess: updateAllProducts.type,
    //       onStart: fetchProducts.type,
    //       onError: fetchProductsError.type,
    //     },
    //     {
    //       url: "cart/5",
    //       onSuccess: loadCartItems.type,
    //       onStart: fetchCartItems.type,
    //       onError: isCartError.type,
    //     },
    //   ]
    // )
    // );
    dispatch(fetchProductsData());
    dispatch(fetchCartItemsData());
  }, [dispatch]);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        borderBottom: "1px solid #c2c2c2",
      }}
    >
      <h4>Company logo</h4>

      <Link to="/cart">cart: {TotalCartItems}</Link>
    </nav>
  );
};

export default Navbar;
