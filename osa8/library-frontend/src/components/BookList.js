import { Container, Table } from "react-bootstrap";

const BookList = ({ books, filterText }) => {
  return (
    <Container>
      {filterText}
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
    </Container>
  );
};

export default BookList;
