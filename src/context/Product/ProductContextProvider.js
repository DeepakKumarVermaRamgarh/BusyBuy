import { createContext, useContext, useReducer } from "react";
import productReducer from "./productReducer";
import {
  LOAD_PRODUCTS_REQUEST,
  LOAD_PRODUCTS_SUCCESS,
  SET_ERROR,
  SET_FILTERED_PRODUCTS,
} from "./productConstants";
import { productCollection } from "../../config/FireBaseConfig";
import { getDocs, query } from "firebase/firestore";

// Create the ProductContext using React Context API
const ProductContext = createContext();

// Custom hook to access the ProductContext's value
export const useProductValue = () => {
  const value = useContext(ProductContext);
  return value;
};

// ProductContextProvider component to manage the state and actions related to products
const ProductContextProvieder = ({ children }) => {
  const initialState = {
    loading: false,
    products: [],
    filteredProducts: [],
    cartProducts: [],
    error: null,
  };

  const [state, dispatch] = useReducer(productReducer, initialState);

  // Function to fetch all products from the database
  const getAllProducts = async () => {
    try {
      dispatch({ type: LOAD_PRODUCTS_REQUEST });
      const productsRef = productCollection;

      const productsSnapshot = await getDocs(query(productsRef));

      // Map the fetched products to the state
      const products = productsSnapshot.docs.map((product) => ({
        ...product.data(),
      }));

      dispatch({ type: LOAD_PRODUCTS_SUCCESS, payload: products });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  // Function to filter products based on filter criteria
  const filterProducts = (filterObj) => {
    const {
      query,
      priceRange,
      category: { mensFashion, womensFashion, jwellery, electronics },
    } = filterObj;

    let filteredProducts = state.products;

    // Apply title query filter
    if (query) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply category filters
    if (mensFashion || womensFashion || jwellery || electronics) {
      filteredProducts = filteredProducts.filter((product) => {
        if (mensFashion && product.category === "men's fashion") return true;
        if (womensFashion && product.category === "women's fashion")
          return true;
        if (electronics && product.category === "electronics") return true;
        if (jwellery && product.category === "jwellery") return true;
      });
    }

    // Apply price range filter
    if (priceRange) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= priceRange
      );
    }

    dispatch({ type: SET_FILTERED_PRODUCTS, payload: filteredProducts });
  };

  const { products, filteredProducts, loading } = state;
  return (
    // Provide the products, filteredProducts, loading state, and action functions to child components
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        loading,
        getAllProducts,
        filterProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
export default ProductContextProvieder;
