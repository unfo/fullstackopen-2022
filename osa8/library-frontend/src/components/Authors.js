import { Table } from "react-bootstrap";
import AuthorAgeForm from "./AuthorAgeForm";

const Authors = ({ show, authors }) => {
  if (!show) {
    return null;
  }

  if (authors.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>authors</h2>
      <Table striped>
        <thead>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
        </thead>
        <tbody>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <AuthorAgeForm authors={authors.data.allAuthors} />
    </div>
  );
};

export default Authors;
