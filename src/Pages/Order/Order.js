import { useEffect, useState } from "react";
import OrderTable from "../../components/OrderTable/OrderTable";
import { useAuthValue } from "../../context/Auth/AuthContextProvider";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/FireBaseConfig";
import { getProductDetails } from "../../utils/firebaseFunctions";
import Loader from "../../components/Loader";

const Order = () => {
  // State variable to hold the user's orders
  const [orders, setOrders] = useState([]);
  // State variable to track the loading status
  const [loading, setLoading] = useState(false);

  // Fetching authentication-related data from the AuthContextProvider
  const { user } = useAuthValue();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Get the order document from Firestore for the current user
        const orderRef = doc(db, "userOrder", user.uid);
        const orderSnap = await getDoc(orderRef);
        // Retrieve the orders data from the document
        const ordersData = orderSnap.data();
        // If there are no orders, display an error message
        if (!orders) return toast.error("No Orders Found!!!");
        // Create an array of promises to fetch the product details for each order
        let promiseArray = [];
        ordersData.orders.forEach((order) => {
          promiseArray.push(
            new Promise((res, rej) => {
              const product = getProductDetails(order);
              if (product) res(product);
              else rej("Something went wrong");
            })
          );
        });

        // Wait for all the promises to resolve and get the product details
        const allOrders = await Promise.all(promiseArray);
        setOrders([...allOrders]);
      } catch (error) {
        console.log(error);
        toast.error("Error in fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1>Your Orders</h1>
          {orders.length
            ? orders.map((order, i) => <OrderTable key={i} order={order} />)
            : "No Orders Found!!!"}
        </>
      )}
    </main>
  );
};
export default Order;
