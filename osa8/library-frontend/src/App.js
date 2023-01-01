import { useState, useEffect } from "react";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./queries";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Notify from "./components/Notify";
import Recommendations from "./components/Recommendations";

const uniqBy = (a, property) => {
  let filtered = a.filter(
    (val, idx, arr) =>
      arr.findIndex((i) => i[property] === val[property]) === idx
  );
  return filtered;
};

export const updateBookCache = (cache, query, addedBook) => {
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqBy(allBooks.concat(addedBook), "title"),
    };
  });
};

export const updateAuthorBookCountCache = (cache, query, author) => {
  cache.updateQuery(query, ({ allAuthors }) => {
    return {
      allAuthors: allAuthors.map((auth) =>
        auth.name === author.name
          ? { ...auth, bookCount: author.bookCount }
          : auth
      ),
    };
  });
};

const App = () => {
  const [page, setPage] = useState("authors");
  // eslint-disable-next-line
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );
  // eslint-disable-next-line
  const [errorMessage, setErrorMessage] = useState(null);
  const authors = useQuery(ALL_AUTHORS);

  const notify = (message) => {
    window.alert(`Error. See console for more details. "${message}"`);
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };
  const client = useApolloClient();

  const login_button = () => {
    if (token) {
      return <button onClick={logout}>logout</button>;
    }
    return <button onClick={() => setPage("login")}>login</button>;
  };

  useEffect(() => {
    console.log("token changed?");
    setPage("authors");
  }, [token]);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      notify(`${addedBook.title} by ${addedBook.author.name} added!`);
      console.log("New book: ", addedBook);
      updateBookCache(client.cache, { query: ALL_BOOKS }, addedBook);
      updateAuthorBookCountCache(
        client.cache,
        { query: ALL_AUTHORS },
        addedBook.author
      );
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };
  return (
    <div className="container">
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("recommendations")}>
          recommendations
        </button>
        <button onClick={() => setPage("add")}>add book</button>
        {login_button()}
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors
        show={page === "authors"}
        authors={authors}
        loggedIn={token != null}
        setErrorMessage={notify}
      />

      <Books show={page === "books"} />
      <Recommendations
        show={page === "recommendations"}
        loggedIn={token != null}
      />

      <NewBook
        show={page === "add"}
        setError={notify}
        loggedIn={token != null}
      />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setError={notify}
      />
    </div>
  );
};

export default App;
