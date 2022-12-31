import { useState, useEffect } from "react";
import { ALL_AUTHORS } from "./queries";
import { useQuery, useApolloClient } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Notify from "./components/Notify";
import Recommendations from "./components/Recommendations";

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
