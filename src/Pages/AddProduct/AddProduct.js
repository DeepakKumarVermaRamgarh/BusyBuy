import { useRef } from "react";
import { db, productCollection } from "../../config/FireBaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "./addProduct.css";

const AddProduct = () => {
  // References to input fields
  const titleRef = useRef();
  const priceRef = useRef();
  const imageRef = useRef();
  const categoryRef = useRef();

  // Function to clear input fields after successful submission
  const clearInputs = () => {
    titleRef.current.value = "";
    priceRef.current.value = "";
    imageRef.current.value = "";
    categoryRef.current.value = "men's fashion";
  };

  // Function to handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      // Fetching the existing products from the database to get the count and set a new ID for the product
      const productsRef = productCollection;
      const productsSnapshot = await getDocs(query(productsRef));
      const id = productsSnapshot.docs.length;

      // Create a new product object based on the input fields
      const newProduct = {
        id,
        title: titleRef.current.value.trim(),
        price: priceRef.current.value.trim(),
        src: imageRef.current.value.trim(),
        category: categoryRef.current.value.trim(),
      };

      // Adding the new product to the "products" collection in the Firestore database
      const newProductRef = productCollection;
      await addDoc(newProductRef, newProduct);

      // Show a success toast message and clear input fields
      toast.success("Product Added Successfully.");
      clearInputs();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={(e) => handleAddProduct(e)}>
      <h2>Add New Product</h2>
      <input
        type="text"
        placeholder="Product Title"
        inputMode="text"
        ref={titleRef}
        required
      />
      <input
        type="number"
        placeholder="Product Price"
        inputMode="number"
        ref={priceRef}
        required
      />
      <input
        type="url"
        placeholder="Product Image Url"
        inputMode="url"
        ref={imageRef}
        required
      />
      <select ref={categoryRef}>
        <option value="men's fashion">Men's Fashion</option>
        <option value="women's fashion">Women's Fashion</option>
        <option value="jwellery">Jwellery</option>
        <option value="electronics">Electronics</option>
      </select>

      <input type="submit" value="Add Product" />
    </form>
  );
};

export default AddProduct;
