import { ALL_BOOKS, ALL_BOOKS_BY_GENRE } from "../queries";
import { useQuery, NetworkStatus } from "@apollo/client";
import { useState, useEffect } from "react";
import BookList from "./BookList";
import { Container } from "react-bootstrap";
const Books = ({ show }) => {
  const [genreList, setGenreList] = useState([]);
  const [genre, setGenreFilter] = useState(null);

  const all_books = useQuery(ALL_BOOKS);

  useEffect(() => {
    if (all_books.data) {
      console.log(all_books.data);
      const genres = all_books.data.allBooks
        .map((book) => book.genres)
        .flat()
        .filter((val, idx, arr) => arr.indexOf(val) === idx);

      setGenreList(genres);
    }
  }, [all_books.data]);

  const genre_books = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre },
    skip: !genre,
    notifyOnNetworkStatusChange: true,
  });

  const changeGenre = (choice) => {
    setGenreFilter(choice);
    if (choice) {
      genre_books.refetch({ genre: choice });
    }
  };

  const genreChooser = () => {
    if (!genreList) {
      return null;
    }

    return (
      <Container>
        <button key="all" onClick={() => setGenreFilter(null)}>
          ALL
        </button>
        {genreList.map((genre_name) => {
          const cssClass = genre === genre_name ? "active" : "passive";
          return (
            <button
              className={cssClass}
              key={genre_name}
              onClick={() => changeGenre(genre_name)}
            >
              {genre_name}
            </button>
          );
        })}
      </Container>
    );
  };

  if (!show) {
    return null;
  }

  console.log(genre_books.networkStatus, NetworkStatus);
  // https://www.apollographql.com/docs/react/data/queries#inspecting-loading-states
  if (genre_books.networkStatus === NetworkStatus.refetch) return "Refetching!";
  if (genre_books.loading) return null;
  if (genre_books.error) return `Error! ${genre_books.error}`;

  if (all_books.loading || (genre && genre_books.loading)) {
    return <div>loading...</div>;
  }

  console.log("genre_books: ", genre_books);

  const books = genre ? genre_books.data.allBooks : all_books.data.allBooks;
  const filterText = genre ? `Books in the ${genre} genre` : `All books`;
  return (
    <div>
      <h2>books</h2>
      {genreChooser()}
      <BookList books={books} filterText={filterText} />
    </div>
  );
};

export default Books;
