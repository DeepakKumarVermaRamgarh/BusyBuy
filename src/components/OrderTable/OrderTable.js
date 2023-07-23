import "./orderTable.css";
import { getDate } from "../../utils/util";

const OrderTable = ({ order }) => {
  return (
    <div className="order-table-container">
      <table>
        {/* Display the date of the order if available */}
        <caption>
          {order[0].date && <h2>Ordered On : {getDate(order[0].date)} </h2>}
        </caption>
        <thead>
          {/* Table header for columns */}
          <tr>
            <th>Products </th>
            <th>Price </th>
            <th>Quantity </th>
            <th>Price </th>
          </tr>
        </thead>

        <tbody>
          {/* Loop through the products in the order and display each row */}
          {order.map((product, i) => (
            <tr key={i}>
              <td>{product.title}</td>
              <td>&#x20B9; {product.price}</td>
              <td>{product.quantity}</td>
              <td>&#x20B9; {product.price * product.quantity}</td>
            </tr>
          ))}
        </tbody>
        {/* Table footer to display the total order amount */}
        <tfoot>
          <tr>
            <td colSpan={3}>Total Order</td>
            <td>
              &#x20B9;{" "}
              {order.reduce((sum, product) => {
                // Calculate the total order amount by summing the price * quantity of each product
                return sum + product.price * product.quantity;
              }, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
export default OrderTable;
