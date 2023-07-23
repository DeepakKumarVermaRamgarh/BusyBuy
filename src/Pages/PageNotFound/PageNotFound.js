import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./pageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      navigate("/");
    }, 5000);
    return clearInterval(interval);
  },[]);

  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      <Link to="/">Go back to the homepage</Link>
    </div>
  );
};

export default PageNotFound;
