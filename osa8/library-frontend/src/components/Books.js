import { Table } from "react-bootstrap";

const Books = ({ show, books }) => {
  if (!show) {
    return null;
  }

  if (books.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>

      <Table striped>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Books;
