import { ALL_BOOKS, ALL_BOOKS_BY_GENRE } from "../queries";
import { useQuery } from "@apollo/client";
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

      console.log("genre list: ", genres);
      setGenreList(genres);
    }
  }, [all_books.data]);

  const genre_books = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre },
    skip: !genre,
  });

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
              onClick={() => setGenreFilter(genre_name)}
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

  if (all_books.loading || (genre && genre_books.loading)) {
    return <div>loading...</div>;
  }

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
