// Importing necessary Firestore functions and references
import {
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, productCollection } from "../config/FireBaseConfig";

// Global Firestore references for user cart and order documents
let userOrderRef;
let userCartRef;

// Function to fetch the user's cart data from Firestore
export const getUserCart = async (uid) => {
  // Get the reference to the user's cart document
  userCartRef = doc(db, "userCart", uid);
  // Fetch the cart data
  const cartItem = await getDoc(userCartRef);
  return { userCartRef, data: cartItem.data() };
};

// Function to retrieve the details of products in the cart from Firestore
export const getProductDetails = async (cart) => {
  // Extracting the product IDs from the cart object
  const productIds = Object.keys(cart).map(Number);
  if (!productIds.length) return false;

  // Query Firestore to get the products whose IDs are present in the cart
  const q = query(productCollection, where("id", "in", productIds));

  const products = await getDocs(q);

  // Create an array of products with additional properties like 'date' and 'quantity'
  const productsData = products.docs.map((doc) => ({
    ...doc.data(),
    date: cart?.date,
    quantity: cart[doc.data().id],
  }));

  return productsData;
};

// Function to place an order for the user in Firestore
export const orderProducts = async (uid, cartProducts) => {
  try {
    // Get the reference to the user's order document
    userOrderRef = doc(db, "userOrder", uid);
    const docSnap = await getDoc(userOrderRef);
    const data = docSnap.data();

    if (data) {
      // If the user has an order document, update the 'orders' field by adding the new order
      updateDoc(userOrderRef, {
        orders: arrayUnion({ ...cartProducts, date: Date.now() }),
      });

      return;
    }

    // If the user does not have an order document, create a new one with the provided cartProducts
    await setDoc(userOrderRef, {
      orders: [{ ...cartProducts, date: Date.now() }],
    });
  } catch (error) {
    console.log(error);
  }
};

// Function to clear the user's cart in Firestore
export const clearCart = async () => {
  // Update the 'myCart' field in the user's cart document to an empty object, clearing the cart
  await updateDoc(userCartRef, {
    myCart: {},
  });
};

// Function to fetch the user's cart products from Firestore
export const getCartProducts = async (uid) => {
  try {
    // Use the getUserCart function to get the cart data
    const { data } = await getUserCart(uid);
    // Extract the 'myCart' field from the data and return it
    const { myCart } = data;
    return myCart;
  } catch (error) {
    console.log(error);
  }
};

// Function to remove a specific product from the user's cart in Firestore
export const removeProductFromCart = async (uid, productId) => {
  try {
    // Use the getUserCart function to fetch the user's cart data
    const { data, docRef } = await getUserCart(uid);
    const { myCart: cart } = data;

    // Check if the product is present in the cart
    if (!cart[productId]) return "Not Found";

    // Remove the product from the cart object
    delete cart[productId];

    // Update the 'myCart' field in Firestore with the updated cart
    await updateDoc(docRef, {
      myCart: {
        ...cart,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
