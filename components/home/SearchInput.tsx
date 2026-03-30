"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Categories = {
  _id: string;
  main: string;
  subs: string[];
};

export default function SearchInput({
  categories,
}: {
  categories: Categories[];
}) {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchText) params.set("q", searchText);
    if (selectedCategory !== "All") params.set("category", selectedCategory);

    router.push(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div
      className={`flex flex-1 mx-3 rounded-xl max-w-full items-stretch border ${searchText ? "border-green-500" : "border-gray-300"} bg-white/50 backdrop-blur-sm items-stretch transition-colors duration-200`}
    >
      <div className="flex items-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-transparent text-sm font-medium outline-none hover:text-green-600 cursor-pointer"
        >
          <option value="All">All</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.main}>
              {cat.main}
            </option>
          ))}
        </select>
        <div className="w-px bg-gray-300 self-stretch" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 px-3 py-2 outline-none text-sm bg-transparent"
      />
      <div className="w-px bg-gray-300 self-stretch" />
      <button
        onClick={handleSearch}
        className="px-3 items-center justify-center transition-colors"
      >
        <Search className="w-5 h-5 text-black hover:text-green-600" />
      </button>
    </div>
  );
}
