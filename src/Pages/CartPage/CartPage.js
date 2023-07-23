import { MdShoppingCartCheckout } from "react-icons/md";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import "./CartPage.css";
import CartProductCard from "../../components/ProductCard/CartProductCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/Auth/AuthContextProvider";
import {
  getCartProducts,
  getProductDetails,
  orderProducts,
  removeProductFromCart,
} from "../../utils/firebaseFunctions";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { db } from "../../config/FireBaseConfig";

const CartPage = () => {
  // State variables
  const [cartProducts, setCartProducts] = useState([]);
  const [cartProductsArr, setCartProductsArr] = useState([]);
  const [order, setOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  // Other hooks and variables
  const navigate = useNavigate();
  const { user } = useAuthValue();

  // Calculate the total cart price
  let cartPrice = cartProducts.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  // Fetch cart data when the component mounts
  useEffect(() => {
    setLoading(true);
    const fetchCartData = async () => {
      try {
        const myCart = await getCartProducts(user.uid);
        setCartProductsArr(myCart);
        const productData = await getProductDetails(myCart);

        if (!productData) {
          return toast.error("Cart is empty.");
        }

        setCartProducts([...productData]);
      } catch (error) {
        console.log(error);
        toast.error("Error in fetching cart data");
      } finally {
        setLoading(false);
      }
    };
    fetchCartData();
  }, []);

  // Function to handle the purchase of products
  const purchaseProducts = async () => {
    setOrder(true);
    try {
      await orderProducts(user.uid, cartProductsArr);
      const userCartRef = doc(db, "userCart", user.uid);
      updateDoc(userCartRef, { myCart: {} });
      setCartProducts([]);
      setCartProductsArr([]);
      navigate("/orders");
      toast.success("Order placed successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setOrder(false);
    }
  };

  // Function to remove a product from the cart
  const removeProduct = async (productId) => {
    try {
      await removeProductFromCart(user.uid, productId);
      delete cartProductsArr[productId];
      setCartProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Removed From Cart.");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Function to update the quantity of a product in the cart
  const updateQuantity = (type, productId) => {
    const cart = cartProducts.map((product) => {
      if (product.id === productId) {
        if (product.quantity <= 1 && type === "sub") return product;
        product.quantity += type === "add" ? 1 : -1;
      }
      return product;
    });

    cartProductsArr[productId] += type === "add" ? 1 : -1;
    setCartProducts(cart);
  };

  return (
    <main>
      {loading ? (
        <Loader />
      ) : (
        <>
          {cartProducts?.length > 0 ? (
            <>
              <div className="row">
                <h2>
                  <span>Total Cart Value : </span>
                  <span>&#x20B9; {cartPrice}/-</span>
                </h2>
                <button onClick={purchaseProducts}>
                  {order ? "Ordering..." : "CheckOut"}{" "}
                  <MdShoppingCartCheckout />
                </button>
              </div>

              <ProductGrid>
                {cartProducts.map((p, i) => (
                  <CartProductCard
                    key={p.i}
                    product={p}
                    productId={i}
                    removeProductFromCart={removeProduct}
                    updateProductQuantity={updateQuantity}
                  />
                ))}
              </ProductGrid>
            </>
          ) : (
            <h1>Cart is empty!</h1>
          )}
        </>
      )}
    </main>
  );
};
export default CartPage;
