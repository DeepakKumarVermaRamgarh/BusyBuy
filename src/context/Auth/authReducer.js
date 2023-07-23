import {
  CLEAR_ERRORS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_USER_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  SET_USER_FAIL,
  SET_USER_REQUEST,
  SET_USER_SUCCESS,
} from "./authConstants";

// Reducer function to manage state changes for user authentication
const authReducer = (state, action) => {
  switch (action.type) {
    // Cases for actions related to login, registration, user loading, and setting user data
    case LOGIN_REQUEST:
    case REGISTER_USER_REQUEST:
    case LOAD_USER_REQUEST:
    case SET_USER_REQUEST:
      return {
        ...state,
        user: null,
        loading: true,
      };

    // Cases for successful login, registration, user loading, and setting user data
    case LOGIN_SUCCESS:
    case REGISTER_USER_SUCCESS:
    case LOAD_USER_SUCCESS:
    case SET_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: true,
      };

    // Cases for login, registration, and user loading failures
    case LOGIN_FAIL:
    case REGISTER_USER_FAIL:
    case LOAD_USER_FAIL:
      return {
        ...state,
        user: null,
        loading: false,
        error: true,
        message: action.payload,
        isAuthenticated: false,
      };

    // Case for successful logout
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        error: false,
        message: action.payload,
        loading: false,
        isAuthenticated: false,
      };

    // Cases for logout and setting user data failures
    case LOGOUT_FAIL:
    case SET_USER_FAIL:
      return {
        ...state,
        error: true,
        message: action.payload,
        loading: false,
        isAuthenticated: true,
      };

    // Case to clear any error messages in the state
    case CLEAR_ERRORS:
      return {
        ...state,
        error: false,
        message: null,
      };

    // Default case for when the dispatched action type is not recognized
    default:
      return state;
  }
};

export default authReducer;
