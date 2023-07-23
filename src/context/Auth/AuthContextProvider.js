import { useContext, useReducer, createContext } from "react";
import authReducer from "./authReducer";
import {
  CLEAR_ERRORS,
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
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../config/FireBaseConfig";
import { toast } from "react-toastify";

// Create a new context for the authentication state
const AuthContext = createContext();

// Custom hook to access the AuthContext value
export const useAuthValue = () => {
  const value = useContext(AuthContext);
  return value;
};

const AuthContextProvider = ({ children }) => {
  // Initial state for user authentication
  const initialState = {
    user: null,
    error: false,
    message: null,
    loading: false,
    isAuthenticated: false,
  };

  // Use reducer to manage state changes based on dispatched actions
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Function to handle user login
  const login = async (email, password) => {
    dispatch({ type: LOGIN_REQUEST });

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      dispatch({ type: LOGIN_SUCCESS, payload: res.user });
      toast.success("Login Successfully.");
    } catch (error) {
      dispatch({ type: LOGIN_FAIL, payload: error.message.split(":")[1] });
    }
  };

  // Function to handle user registration
  const register = async (formData) => {
    dispatch({ type: REGISTER_USER_REQUEST });

    try {
      const { name, email, password } = formData;

      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      dispatch({ type: REGISTER_USER_SUCCESS, payload: res.user });
      toast.success("Registered Successfully.");
    } catch (error) {
      dispatch({
        type: REGISTER_USER_FAIL,
        payload: error.message.split(":")[1],
      });
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: LOGOUT_SUCCESS });
      toast.success("Log Out successfully.");
    } catch (error) {
      dispatch({ type: LOGOUT_FAIL, payload: "Something went wrong!" });
    }
  };

  // Function to clear error messages from the state
  const clearError = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  // Function to set the authenticated user
  const setUser = async (user) => {
    try {
      dispatch({ type: SET_USER_REQUEST });
      dispatch({ type: SET_USER_SUCCESS, payload: user });
    } catch (error) {
      dispatch({ type: SET_USER_FAIL, payload: error.message.split(":")[1] });
    }
  };

  // Destructure the state values for user authentication
  const { user, message, error, loading, isAuthenticated } = state;

  // Provide the authentication state and actions through the AuthContext
  return (
    <AuthContext.Provider
      value={{
        user,
        message,
        error,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        clearError,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
