import { IoLogoGoogle } from "react-icons/io5";
import "./login.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import validator from "validator";
import { useAuthValue } from "../../context/Auth/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/FireBaseConfig";

const SignUp = () => {
  // State variables to hold user registration data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Navigate hook from react-router-dom
  const navigate = useNavigate();

  // Fetching authentication-related functions and data from the AuthContextProvider
  const {
    isAuthenticated,
    loading,
    message,
    error,
    clearError,
    register,
    user,
  } = useAuthValue();

  useEffect(() => {
    // Redirect to homepage if user is already authenticated or registration fails
    if (isAuthenticated && user) {
      navigate("/");
    }
    if (error) {
      toast.error(message.split("/")[1]);
      clearError();
    }
  }, [error, message, isAuthenticated, user]);

  // Function to handle user registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate user input
    if (name === "" || email === "" || password === "") {
      return toast.error("Please enter valid details!!!");
    }

    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) {
      toast.error("Enter valid email.");
      return;
    }

    const isStrongPassword = validator.isStrongPassword(password);
    if (!isStrongPassword) {
      toast.info("Enter Strong Password");
      return;
    }

    // Call the register function from AuthContextProvider
    await register({ name, email, password });

    const userRef = doc(db, "users", auth.currentUser.uid);
    // Create a user document in Firestore with additional user details
    await setDoc(userRef, {
      email: auth.currentUser.email,
      name: auth.currentUser.displayName,
      role: "user",
    });
  };

  return (
    <main>
      <div className="login-container">
        <h2>Register Here</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            inputMode="text"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value.trim())}
            required
          />
          <input
            type="email"
            inputMode="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value.trim())}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value.trim())}
            required
          />
          <input
            type="submit"
            value={loading ? "Registering..." : "Register"}
          />
          {/* <span>OR</span>
          <button type="button" onClick={handleSignUpUsingGoogle}>
            <IoLogoGoogle /> Login Using Google
          </button> */}
        </form>
      </div>
    </main>
  );
};

export default SignUp;
