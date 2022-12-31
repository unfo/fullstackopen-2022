import { Table } from "react-bootstrap";
import { ALL_BOOKS, ALL_BOOKS_BY_GENRE } from "../queries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    console.log(`Filtering for ${genre} books now`);
  }, [genre]);

  const genre_books = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre },
    skip: !genre,
  });

  const genreChooser = () => {
    if (!genreList) {
      return null;
    }

    return (
      <>
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
      </>
    );
  };

  if (!show) {
    return null;
  }

  if (all_books.loading || (genre && genre_books.loading)) {
    return <div>loading...</div>;
  }

  const books = genre ? genre_books.data.allBooks : all_books.data.allBooks;

  console.log("books", books);
  console.log("genre", genre_books);
  console.log("all", all_books);
  return (
    <div>
      <h2>books</h2>
      {genreChooser()}
      <Table striped>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Books;
