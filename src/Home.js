import { useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [SelectValue, setSelectValue] = useState("");
  const [SelectCartValue, setSelectCartValue] = useState("");

  const { list: products, loading } = useSelector((state) => state.Products);
  const CartItems = useSelector((state) => state.cartItems.list);
  // const loading =useSelector(state => state.Products.loading)
  // console.log("loading", loading);

  const finalCartValue = CartItems.map((CItems) => {
    const ProductItem = products.find((ele) => ele.id === CItems.Pid);
    return ProductItem ? { ProductItem, quantity: CartItems.quanity } : null;
  }).filter(Boolean);
  //   console.log("products", products);
  //   console.log("CartItems", CartItems);
  const filteredCartValue = finalCartValue.filter((ele) => {
    let search = searchInput.toLowerCase();
    let name = ele?.ProductItem?.name?.toLowerCase() || "";
    let title = ele?.ProductItem?.title?.toLowerCase() || "";
    let category = ele?.ProductItem?.category?.toLowerCase() || "";

    return (
      name.includes(search) ||
      title.includes(search) ||
      category.includes(search)
    );
  });
  // console.log(
  //   "finalCartValue",
  //   finalCartValue.map((ele) => ele.ProductItem)
  // );

  const Productoptions =
    products.map((product) => ({
      value: product.id,
      label: product.title,
    })) || [];
  const Cartoptions =
    finalCartValue.map((cartitem) => ({
      value: cartitem.ProductItem.id,
      label: cartitem.ProductItem.title,
    })) || [];

  return (
    <div style={{ width: "300px" }}>
      <Select
        value={SelectValue}
        onChange={(value) => setSelectValue(value)}
        options={Productoptions}
        placeholder="Select Product"
        isSearchable
        isClearable
      />
      {SelectValue && SelectValue.label === "Red Lipstick" && (
        <Select
          value={SelectCartValue}
          onChange={(value) => setSelectCartValue(value)}
          options={Cartoptions}
          placeholder="Select cart item"
          isSearchable
          isClearable
        />
      )}
      {loading && <h2>loading...</h2>}
      {SelectCartValue.label === "Dior J'adore" && (
        <div style={{ display: "inline-flex" }}>
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>image</th>
                <th>name</th>
                <th>shippingInformation</th>
                <th>rating out of 5</th>
                <th>returnPolicy</th>
              </tr>
            </thead>
            <tbody>
              {filteredCartValue.map((ele) => (
                <tr key={ele.ProductItem.id}>
                  {/* {console.log("ele", ele.ProductItem.id)} */}
                  <td>{ele.ProductItem.title}</td>
                  <td>
                    {
                      <img
                        style={{ width: "100px" }}
                        src={ele.ProductItem.images}
                        alt={ele.ProductItem.id + ele.ProductItem.images}
                      />
                    }
                  </td>
                  <td>{ele.ProductItem.name}</td>
                  <td>{ele.ProductItem.shippingInformation}</td>
                  <td>{ele.ProductItem.rating}</td>
                  <td>{ele.ProductItem.returnPolicy}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <input
              style={{ display: "inline-flex" }}
              type="search"
              name="search"
              placeholder="search here..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
