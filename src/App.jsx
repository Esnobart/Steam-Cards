import { useState, useEffect } from "react";
import "./App.css";
import { api } from "./api";
import { sortCollection } from "./sorting";

function App() {
  const [collections, setCollections] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await api.get("/collections");

        setCollections(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleSort = (field) => {
    setCurrentPage(1);

    if (sortBy === field)
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const sortedCollections = sortCollection(collections, sortBy, sortDirection);

  const totalPages = Math.ceil(sortedCollections.length / 100);
  const startIndex = (currentPage - 1) * 100;

  const visibleCollections = sortedCollections.slice(
    startIndex,
    startIndex + 100,
  );

  const changePage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  if (collections == null || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rootDiv">
      <table className="table">
        <thead className="thead">
          <tr>
            <th>
              <button
                className="tableBtn"
                type="button"
                onClick={() => handleSort("gameName")}
              >
                Game Name
              </button>
            </th>
            <th>
              <button
                className="tableBtn"
                type="button"
                onClick={() => handleSort("totalCards")}
              >
                Num of Cards in Collection
              </button>
            </th>
            <th>
              <button
                className="tableBtn"
                type="button"
                onClick={() => handleSort("totalPrice")}
              >
                Total Price
              </button>
            </th>
            <th className="tableUrl">URL</th>
          </tr>
        </thead>

        <tbody>
          {visibleCollections.map((item) => (
            <tr
              key={`${item.appId}-${item.url}-${item.totalPrice}`}
              className="tableRow"
            >
              <td>{item.gameName}</td>
              <td>{item.totalCards}</td>
              <td>
                {item.totalPrice} {item.currency}
              </td>
              <td>
                <a href={item.url}>Buy on Steam</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="NavBttnsContainer">
        {currentPage > 1 && (
          <button
            type="button"
            onClick={() => changePage(currentPage - 1)}
            className="NavBttns"
          >
            Previous Page
          </button>
        )}
        {currentPage < totalPages && (
          <button
            type="button"
            onClick={() => changePage(currentPage + 1)}
            className="NavBttns"
          >
            Next Page
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
