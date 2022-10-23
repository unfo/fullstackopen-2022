import { useState } from 'react';
import { Form, Button, Table } from 'react-bootstrap';

const FormRow = ({ paramName, paramValue, paramChanged }) => {
  return (
    <tr>
      <th>
        <label htmlFor={paramName}>{paramName}</label>
      </th>
      <td>
        <input
          id={paramName}
          name={paramName}
          value={paramValue}
          onChange={paramChanged}
        />
      </td>
    </tr>
  );
};

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async (event) => {
    event.preventDefault();
    const newBlog = {
      title,
      author,
      url,
    };
    createBlog(newBlog);
    setAuthor('');
    setTitle('');
    setUrl('');
  };
  return (
    <>
      <h2>Add new blog</h2>
      <Form onSubmit={addBlog}>
        <Table striped bordered>
          <tbody>
            <FormRow
              paramName="title"
              paramValue={title}
              paramChanged={({ target }) => {
                setTitle(target.value);
              }}
            />
            <FormRow
              paramName="author"
              paramValue={author}
              paramChanged={({ target }) => {
                setAuthor(target.value);
              }}
            />
            <FormRow
              paramName="url"
              paramValue={url}
              paramChanged={({ target }) => {
                setUrl(target.value);
              }}
            />
          </tbody>
        </Table>
        <Button className="submitButton" id="create-blog" type="submit">
          Create
        </Button>
      </Form>
    </>
  );
};

export default BlogForm;
