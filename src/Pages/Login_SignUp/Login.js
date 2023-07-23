import { IoLogoGoogle } from "react-icons/io5";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuthValue } from "../../context/Auth/AuthContextProvider";
import { toast } from "react-toastify";
import validator from "validator";

const Login = () => {
  // References to the email and password input fields
  const emailRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate(); // Navigate hook from react-router-dom

  // Fetching authentication-related functions and data from the AuthContextProvider
  const { loading, isAuthenticated, error, message, login, clearError, user } =
    useAuthValue();

  useEffect(() => {
    // Redirect to homepage if user is already authenticated or login fails
    if (isAuthenticated && user) {
      navigate("/");
    }

    if (error) {
      toast.error(message.split("/")[1]);
      clearError();
    }
  }, [error, isAuthenticated, user]);

  // Function to handle user login
  const loginHandler = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    // Validate user input
    if (
      email === "" ||
      password === "" ||
      !validator.isEmail(email) ||
      !validator.isStrongPassword(password)
    ) {
      return toast.error("Please enter valid data!!!");
    }

    // Call the login function from AuthContextProvider
    await login(email, password);
  };

  return (
    <main>
      <div className="login-container">
        <h2>Welcome User !</h2>
        <form onSubmit={(e) => loginHandler(e)}>
          {/* <input type="text" placeholder="Full Name" /> */}
          <input
            type="email"
            inputMode="email"
            placeholder="Email"
            ref={emailRef}
          />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <input type="submit" value={loading ? "Logging..." : "Login"} />
        </form>
        <p>
          Not have an account ? <Link to="/register">Sign Up</Link>{" "}
        </p>
      </div>
    </main>
  );
};

export default Login;
