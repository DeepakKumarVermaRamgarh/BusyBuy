import { useState } from "react";
import "./productCard.css";
import { FaCartShopping } from "react-icons/fa6";
import { useAuthValue } from "../../context/Auth/AuthContextProvider";
import { Navigate } from "react-router-dom";
import { getUserCart } from "../../utils/firebaseFunctions";
import { setDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const ProductCard = ({ product, productId }) => {
  // Destructure the product details
  const { src, title, price } = product;
  // State to track the status of adding the product to the cart
  const [addIntoCartStatus, setAddIntoCartStatus] = useState(false);
  // Get authentication state and user data from AuthContextProvider
  const { isAuthenticated, user } = useAuthValue();

  // Handler to add the product into the user's cart
  const addIntoCartHandler = async () => {
    setAddIntoCartStatus(true);
    // If the user is not authenticated, navigate to the login page
    if (!isAuthenticated && !user) return <Navigate to={"/"} />;
    try {
      // Get the user's cart and cart reference from the database
      const { data, userCartRef } = await getUserCart(user.uid);
      // If the product already exists in the cart, update its count
      if (data && data.myCart[productId]) {
        const { myCart: cart } = data;
        const currentProductCount = cart[productId];
        const updatedCart = {
          ...cart,
          [productId]: currentProductCount + 1,
        };
        // Update the cart document in the database
        updateDoc(userCartRef, {
          myCart: updatedCart,
        });
        // Show a success toast message
        return toast.success("Increase Product Count");
      }
      // If the product doesn't exist in the cart, add it with a count of 1
      const cart = data?.myCart || {};
      await setDoc(userCartRef, {
        myCart: { ...cart, [productId]: 1 },
      });
      // Show a success toast message
      toast.success("Added Into Cart.");
    } catch (error) {
      // Show an error toast message if there's an issue with the operation
      toast.error(error.message);
    } finally {
      // Set the addIntoCartStatus back to false after the operation is done
      setAddIntoCartStatus(false);
    }
  };

  return (
    <div className="product-card-container">
      {/* Product image */}
      <div className="product-image-container">
        <img src={src} alt={title} className="product-image" />
      </div>
      {/* Product title */}
      <h3 className="product-title">{title}</h3>
      {/* Product price */}
      <h2 className="product-price">{price}</h2>
      {/* Button to add the product to the cart */}
      <button className="add-to-cart-btn" onClick={addIntoCartHandler}>
        {/* Show "Adding..." when the product is being added to the cart */}
        {addIntoCartStatus ? "Adding..." : "Add to cart"} <FaCartShopping />
      </button>
    </div>
  );
};

export default ProductCard;
