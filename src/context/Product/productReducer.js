import {
  CLEAR_ERRORS,
  LOAD_PRODUCTS_REQUEST,
  LOAD_PRODUCTS_SUCCESS,
  SET_CART_PRODUCTS,
  SET_ERROR,
  SET_FILTERED_PRODUCTS,
} from "./productConstants";

const productReducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS_REQUEST:
      // When loading products, set the loading state to true
      return {
        ...state,
        loading: true,
      };

    case LOAD_PRODUCTS_SUCCESS:
      // When products are successfully loaded, update the state with the fetched products
      return {
        ...state,
        loading: false,
        products: action.payload,
      };
    case SET_FILTERED_PRODUCTS:
      // When filtered products are set, update the state with the new filtered products
      return {
        ...state,
        filteredProducts: action.payload,
      };
    case SET_ERROR:
      // When an error occurs, update the state with the error message and set loading to false
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case SET_CART_PRODUCTS:
      // When cart products are set, update the state with the new cart products
      return {
        ...state,
        cartProducts: action.payload,
      };
    case CLEAR_ERRORS:
      // When clearing errors, set the error state to null
      return {
        ...state,
        error: null,
      };
    default:
      // If none of the action types match, return the current state without any changes
      return state;
  }
};

export default productReducer;
