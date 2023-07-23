import "./productCard.css";
import {
  AiFillMinusCircle,
  AiFillPlusCircle,
  AiFillDelete,
} from "react-icons/ai";

const CartProductCard = ({
  product,
  productId,
  removeProductFromCart,
  updateProductQuantity,
}) => {
  return (
    <div className="product-card-container">
      {/* Product image */}
      <div className="product-image-container">
        <img src={product.src} alt={product.title} className="product-image" />
      </div>

      {/* Product title */}
      <h3 className="product-title">{product.title}</h3>

      {/* Product price and quantity */}
      <h2 className="product-price">
        {product.price}
        {/* Quantity box with "+" and "-" icons to update the product quantity */}
        <div className="qty-box">
          <AiFillMinusCircle
            onClick={() => updateProductQuantity("sub", productId)}
          />
          <span>{product.quantity}</span>
          <AiFillPlusCircle
            onClick={() => updateProductQuantity("add", productId)}
          />
        </div>
      </h2>
      {/* Button to remove the product from the cart */}
      <button
        className="remove-from-cart-btn"
        onClick={() => removeProductFromCart(productId)}
      >
        Remove From Cart <AiFillDelete />
      </button>
    </div>
  );
};

export default CartProductCard;
