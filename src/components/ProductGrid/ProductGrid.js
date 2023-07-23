import "./productGrid.css";

const ProductGrid = ({ children }) => {
  // The ProductGrid component is a container for displaying a grid of products.
  // It renders the `children` components inside the grid container.
  return <div className="product-grid-container">{children}</div>;
};

export default ProductGrid;
