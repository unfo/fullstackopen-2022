import { useMutation } from "@apollo/client";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from "../queries";

const NewBook = ({ show, setError, loggedIn }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedYear, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error);
    },
  });

  if (!show) {
    return null;
  }
  const submit = async (event) => {
    event.preventDefault();
    const published = parseInt(publishedYear);
    createBook({ variables: { title, published, author, genres } });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  if (!loggedIn) {
    return (
      <>
        <h1>New book details</h1>
        <div>You need to login to add data</div>
      </>
    );
  }

  return (
    <div className="container">
      <h1>New book details</h1>
      <Form onSubmit={submit}>
        <InputGroup id="bookTitle">
          <Form.Control
            placholder="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <InputGroup.Text>Title</InputGroup.Text>
        </InputGroup>
        <InputGroup id="bookAuthor">
          <Form.Control
            placholder="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <InputGroup.Text>Author</InputGroup.Text>
        </InputGroup>
        <InputGroup id="bookPublished">
          <Form.Control
            placholder="Published"
            value={publishedYear}
            onChange={({ target }) => setPublished(target.value)}
          />
          <InputGroup.Text>Published</InputGroup.Text>
        </InputGroup>
        <InputGroup id="bookGenre">
          <Form.Control
            placholder="Genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <Button onClick={addGenre} type="button">
            add genre
          </Button>
        </InputGroup>
        <div>
          <h3>genres</h3> {genres.join(", ")}
        </div>
        <Button type="submit">create book</Button>
      </Form>
    </div>
  );
};

export default NewBook;
