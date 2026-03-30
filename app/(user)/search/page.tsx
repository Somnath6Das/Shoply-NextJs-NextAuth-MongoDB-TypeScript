"use client";

import PriceFilter from "@/components/home/PriceFilter";
import ProductItem from "@/components/home/ProductItem";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Filters {
  minPrice: number;
  maxPrice: number;
  brands: string[];
}

interface Product {
  _id: string;
  name: string;
  allImages?: string[];
  minPrice?: number;
  maxPrice?: number;
  variants: {
    price: number;
  }[];
  category: {
    sub: string;
  };
}
export default function SearchPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 0,
    brands: [],
  });
  const [availableBrands, setAvailableBrands] = useState([]);
  const [minPriceSlider, setMinPriceSlider] = useState(0);
  const [maxPriceSlider, setMaxPriceSlider] = useState(0);
  const [absoluteMin, setAbsoluteMin] = useState(0);
  const [absoluteMax, setAbsoluteMax] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const fetchProducts = async (customFilters = filters, isInitial = false) => {
    setLoading(true);
    try {
      const query = searchParams.get("q") || "";
      const category = searchParams.get("category") || "";

      const params = {
        q: query,
        category,
        brands: customFilters.brands.join(","),
        minPrice: customFilters.minPrice,
        maxPrice: customFilters.maxPrice,
      };
      const response = await axios.get("/api/products/search", {
        params,
      });
      const data = response.data;
      setProducts(data.products);
      setAvailableBrands(data.brands);

      if (!initialized || isInitial) {
        setAbsoluteMin(data.minPrice);
        setAbsoluteMax(data.maxPrice);
        setMinPriceSlider(data.minPrice);
        setMaxPriceSlider(data.maxPrice);

        setFilters({
          ...customFilters,
          minPrice: data.minPrice,
          maxPrice: data.maxPrice,
        });
        setInitialized(true);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    const resetFilters = {
      minPrice: absoluteMin,
      maxPrice: absoluteMax,
      brands: [],
    };
    setFilters(resetFilters);
    setMaxPriceSlider(absoluteMin);
    setMaxPriceSlider(absoluteMax);
    fetchProducts(resetFilters);
  };
  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];

    const updatedFilters = { ...filters, brands: newBrands };
    setFilters(updatedFilters);
    fetchProducts(updatedFilters);
  };
  const applyFilters = () => {
    const updated = {
      ...filters,
      minPrice: minPriceSlider,
      maxPrice: maxPriceSlider,
    };
    setFilters(updated);
    fetchProducts(updated);
  };
  useEffect(() => {
    fetchProducts(filters, true);
  }, [searchParams]);
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <aside className="w-64 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={clearFilters}
                disabled={
                  filters.brands.length === 0 &&
                  filters.minPrice === absoluteMin &&
                  filters.maxPrice === absoluteMax
                }
                className={`text-sm ${
                  filters.brands.length === 0 &&
                  filters.minPrice === absoluteMin &&
                  filters.maxPrice === absoluteMax
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                Clear All
              </button>
            </div>
            {/* Brand Filter */}
            <div>
              <h3 className="font-semibold mb-3">Brands</h3>
              <div className="space-y-3">
                {availableBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-4 h-4 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-6">
              <PriceFilter
                minPriceSilder={minPriceSlider}
                maxPriceSilder={maxPriceSlider}
                setMinPriceSilder={setMinPriceSlider}
                setMaxPriceSilder={setMaxPriceSlider}
                absoluteMin={absoluteMin}
                absoluteMax={absoluteMax}
                applyFilters={applyFilters}
              />
            </div>
          </aside>
          <main className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">
                Search Results
                {searchParams.get("q") && ` for "${searchParams.get("q")}"`}
              </h1>
              <p className="text-gray-600">{products.length} products found</p>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No products found
              </div>
            ) : (
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, 240px)",
                  justifyContent: "start",
                }}
              >
                {products.map((product) => (
                  <ProductItem key={product._id} item={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
