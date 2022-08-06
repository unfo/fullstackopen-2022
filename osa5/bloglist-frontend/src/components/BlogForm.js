import { useState } from 'react';

const FormRow = ({ paramName, paramValue, paramChanged, }) => {
  return (
    <tr>
      <th><label htmlFor={paramName}>{paramName}</label></th>
      <td><input id={paramName} name={paramName} value={paramValue} onChange={paramChanged} /></td>
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
      title, author, url
    };
    createBlog(newBlog);
    setAuthor('');
    setTitle('');
    setUrl('');
  };
  return (
    <form onSubmit={addBlog}>
      <table>
        <thead>
          <tr>
            <th colSpan='2'>create new blog</th>
          </tr>
        </thead>
        <tbody>
          <FormRow paramName='title' paramValue={title} paramChanged={({ target }) => { setTitle(target.value); }} />
          <FormRow paramName='author' paramValue={author} paramChanged={({ target }) => { setAuthor(target.value); }} />
          <FormRow paramName='url' paramValue={url} paramChanged={({ target }) => { setUrl(target.value); }} />
        </tbody>
      </table>
      <input type='submit' value='create' />
    </form>
  );
};

export default BlogForm;