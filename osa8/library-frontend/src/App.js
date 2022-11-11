import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(ALL_BOOKS);
  const notify = (message) => {
    window.alert(`Error. See console for more details. "${message}"`);
  };
  return (
    <div className="container">
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} authors={authors} />

      <Books show={page === "books"} books={books} />

      <NewBook show={page === "add"} setError={notify} />
    </div>
  );
};

export default App;
