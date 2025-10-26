import React, { useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchPanel.scss";

function SearchPanel({ onClose,clickSearchPanel }) {
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutSide(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
        clickSearchPanel.current="auto";
      }
    }

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  },[onClose]);

  return (
    <>
      <div ref={panelRef} className="SearchPanel active">
        <h2>Search</h2>

        <div className="searchBox">
          <FaSearch />
          <input type="text" placeholder="Search" />
        </div>
      </div>
    </>
  );
}

export default SearchPanel;
