import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./List.scss";
import { getProductsApi } from "../../services/api";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useIsMobile } from "../../hooks/useIsMobile";
import Loader from "../../components/Loader/Loader";

export default function List() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(slug || "all");
  const [openFilter, setOpenFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsLoading(true);
    getProductsApi()
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = products.filter((product) => {
    if (category === "all") return true;
    return product.category === category;
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="list-page">
          {category && (
            <h1>
              <span>{category}</span> products
            </h1>
          )}
          <div className="list-page-cntnr">
            {/* Filters */}
            <aside className="filter" data-aos="zoom-in-right">
              <div
                className="filter__header"
                onClick={() => setOpenFilter(!openFilter)}
              >
                <strong>Filters</strong>
                {isMobile && (
                  <span>
                    {openFilter ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </span>
                )}
              </div>

              {(!isMobile || openFilter) && (
                <div
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="filter__category-cntnr"
                >
                  <button
                    onClick={() => setCategory("all")}
                    className={category === "all" ? "active" : ""}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setCategory("masala")}
                    className={category === "masala" ? "active" : ""}
                  >
                    Masala
                  </button>
                  <button
                    onClick={() => setCategory("mix")}
                    className={category === "mix" ? "active" : ""}
                  >
                    Mix
                  </button>
                  <button
                    onClick={() => setCategory("malt")}
                    className={category === "malt" ? "active" : ""}
                  >
                    Malt
                  </button>
                </div>
              )}
            </aside>

            {/* Product Grid */}
            <section className="products">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p>No products found</p>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
