// Import necessary CSS styles and components
import "./app.css";
import Navbar from "./components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import required modules from react-router-dom
import { Navigate, Route, Routes } from "react-router-dom";

// Import page components
import HomePage from "./Pages/HomePage/HomePage";
import CartPage from "./Pages/CartPage/CartPage";
import Order from "./Pages/Order/Order";
import Login from "./Pages/Login_SignUp/Login";
import SignUp from "./Pages/Login_SignUp/SignUp";

// Import necessary context and hooks
import { useAuthValue } from "./context/Auth/AuthContextProvider";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./config/FireBaseConfig";
import AddProduct from "./Pages/AddProduct/AddProduct";
import { doc, getDoc } from "firebase/firestore";

// Import and wrap product context provider
import ProductContextProvider from "./context/Product/ProductContextProvider";
import PageNotFound from "./Pages/PageNotFound/PageNotFound";

const App = () => {
  // State variables for user role
  const [userRole, setUserRole] = useState();
  // Get user and authentication status from the AuthContextProvider
  const { setUser, isAuthenticated, user } = useAuthValue();
  // ProtectedRoute component to protect certain routes based on authentication
  const ProtectedRoute = ({ element: Element, ...rest }) => {
    if (isAuthenticated && user) {
      return <Element {...rest} />;
    } else {
      return <Navigate to="/login" />;
    }
  };
  // Function to fetch and set user role based on user ID
  const getUserRole = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userData = await getDoc(userRef);
    const user = userData.data();
    setUserRole(user.role);
  };

  useEffect(() => {
    // Effect hook to listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await getUserRole(user.uid);
      } else {
        setUser(null);
        setUserRole(null);
      }
    });
    // Unsubscribe from the onAuthStateChanged listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <ProductContextProvider>
      <div className="app">
        {/* ToastContainer to display notifications */}
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
          draggable
        />

        {/* Render the Navbar component */}
        <Navbar userRole={userRole} />

        {/* Define routes using react-router-dom */}
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route
            path="/cart"
            exact
            element={<ProtectedRoute element={CartPage} />}
          />
          <Route
            path="/orders"
            exact
            element={<ProtectedRoute element={Order} />}
          />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<SignUp />} />
          {/* AddProduct route is accessible only to "admin" users */}
          {userRole === "admin" && (
            <Route
              path="/add_product"
              exact
              element={<ProtectedRoute element={AddProduct} />}
            />
          )}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </ProductContextProvider>
  );
};
export default App;
