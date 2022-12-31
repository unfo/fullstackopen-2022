import { USER_FAVORITE_GENRE, ALL_BOOKS_BY_GENRE } from "../queries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import BookList from "./BookList";
import { Container } from "react-bootstrap";

const Recommendations = ({ show, loggedIn }) => {
  const [genre, setGenreFilter] = useState(null);

  const favorite_genre = useQuery(USER_FAVORITE_GENRE);
  const genre_books = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre },
    skip: !genre,
  });

  useEffect(() => {
    if (favorite_genre.data) {
      setGenreFilter(favorite_genre.data.me.favoriteGenre);
    }
  }, [favorite_genre.data]);

  if (!show) {
    return null;
  }
  if (!loggedIn) {
    return <>Please login to view recommendations</>;
  }

  if (favorite_genre.loading || (genre && genre_books.loading)) {
    return <div>loading...</div>;
  }

  const filterText = (
    <div>
      books in your favorite genre <b>{genre}</b>
    </div>
  );
  console.log("We should now have favorite books");
  console.log(genre_books);
  return (
    <Container>
      <h1>Recommendations</h1>
      <BookList books={genre_books.data.allBooks} filterText={filterText} />
    </Container>
  );
};

export default Recommendations;
