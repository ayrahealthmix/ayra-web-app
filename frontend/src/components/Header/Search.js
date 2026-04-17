import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { searchProductApi } from "../../services/api";
import "./Search.scss";

const Search = ({ isMobile = false, onClose = () => {} }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Debounced search function
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      setSearchError(null);

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await searchProductApi(searchQuery);
          const availableProducts = res.data.data.filter(
            (product) => product.isAvailable === true,
          );
          setSearchResults(availableProducts);
          setIsDropdownOpen(true);
        } catch (error) {
          setSearchError("Failed to search products");
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // 300ms debounce
    } else {
      setSearchResults([]);
      setIsSearching(false);
      setIsDropdownOpen(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (!isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobile]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to list page with search query
      navigate(`/list?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsDropdownOpen(false);
      onClose();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = () => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    onClose();
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return <div className="search-loading">Searching...</div>;
    }

    if (searchError) {
      return <div className="search-error">{searchError}</div>;
    }

    if (searchResults.length > 0) {
      return (
        <>
          <div className="search-results-list">
            {searchResults.slice(0, 5).map((product) => (
              <Link
                key={product.productId}
                to={`/details/${product.productId}`}
                className="search-result-item"
                onClick={handleResultClick}
              >
                <img src={product.thumbnail} alt={product.name} />
                <div className="search-result-name">{product.name}</div>
              </Link>
            ))}
            {searchResults.length > 5 && (
              <Link
                to={"/list/all"}
                className="search-result-view-all"
                onClick={handleResultClick}
              >
                View all {searchResults.length} results
              </Link>
            )}
          </div>
        </>
      );
    }

    if (searchQuery.trim().length > 0 && !isSearching) {
      return <div className="search-no-results">No products found</div>;
    }

    return null;
  };

  if (isMobile) {
    return (
      <div className="search-mobile">
        <div className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
          />
        </div>
        {renderSearchResults()}
      </div>
    );
  }

  return (
    <div className="search-desktop" ref={searchRef}>
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search products..."
          aria-label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <SearchIcon />
      </form>

      {/* Desktop Search Results Dropdown */}
      {isDropdownOpen && (
        <div className="search-results-dropdown">{renderSearchResults()}</div>
      )}
    </div>
  );
};

export default Search;
