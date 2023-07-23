import "./homepage.css";

import ProductGrid from "../../components/ProductGrid/ProductGrid";
import ProductCard from "../../components/ProductCard/ProductCard";
import Loader from "../../components/Loader";
import { useEffect, useState } from "react";
import { useProductValue } from "../../context/Product/ProductContextProvider";

const HomePage = () => {
  // State variables for filtering and searching
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState(75000);
  const [category, setCategory] = useState({
    mensFashion: false,
    womensFashion: false,
    jwellery: false,
    electronics: false,
  });

  // Fetch products and filtered products from the ProductContextProvider
  const {
    loading,
    getAllProducts,
    products,
    filteredProducts,
    filterProducts,
  } = useProductValue();

  // Fetch all products when the component mounts
  useEffect(() => {
    getAllProducts();
  }, []);

  // Update filtered products when filter or search settings change
  useEffect(() => {
    filterProducts({ priceRange, query, category });
  }, [priceRange, query, category, products]);

  return (
    <main>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Filter and search box */}
          <div className="filter-box-container">
            <div className="price-range-container">
              <label htmlFor="price-range">Filter By Price :</label>
              <span>0</span>
              <input
                type="range"
                id="price-range"
                max={80000}
                min={100}
                step={100}
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
              <span>{priceRange}</span>
            </div>

            {/* Category filter */}
            <div className="category-box">
              <label>Category : </label>
              <div className="check-list">
                <span>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setCategory((prev) => ({
                        ...prev,
                        mensFashion: e.target.checked,
                      }))
                    }
                  />{" "}
                  Men's Fashion
                </span>
                <span>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setCategory((prev) => ({
                        ...prev,
                        electronics: e.target.checked,
                      }))
                    }
                  />{" "}
                  Electronics
                </span>
                <span>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setCategory((prev) => ({
                        ...prev,
                        womensFashion: e.target.checked,
                      }))
                    }
                  />{" "}
                  Women's Fashion
                </span>
                <span>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setCategory((prev) => ({
                        ...prev,
                        jwellery: e.target.checked,
                      }))
                    }
                  />{" "}
                  Jwellery
                </span>
              </div>
            </div>

            {/* Search box */}
            <div className="search-box">
              <input
                type="text"
                inputMode="text"
                className="search"
                placeholder="Search Product By Name Here..."
                value={query}
                onChange={(e) => setQuery(e.target.value.trim())}
              />
            </div>
          </div>

          {/* Display products in a grid */}
          <ProductGrid>
            {products.length || filteredProducts?.length ? (
              filteredProducts?.map((product, i) => (
                <ProductCard key={i} product={product} productId={i} />
              ))
            ) : (
              <h2>No Product Found </h2>
            )}
          </ProductGrid>
        </>
      )}
    </main>
  );
};

export default HomePage;
