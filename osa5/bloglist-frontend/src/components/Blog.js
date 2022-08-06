const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>
);

const FormRow = ({ paramName, paramValue, paramChanged, }) => {
  return (
    <tr>
      <th><label htmlFor={paramName}>{paramName}</label></th>
      <td><input id={paramName} name={paramName} value={paramValue} onChange={paramChanged} /></td>
    </tr>
  );
};
const BlogForm = ({
  title, titleChanged,
  author, authorChanged,
  url, urlChanged,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit}>
      <table>
        <thead>
          <tr>
            <th colSpan='2'>create new blog</th>
          </tr>
        </thead>
        <tbody>
          <FormRow paramName='title' paramValue={title} paramChanged={titleChanged} />
          <FormRow paramName='author' paramValue={author} paramChanged={authorChanged} />
          <FormRow paramName='url' paramValue={url} paramChanged={urlChanged} />
        </tbody>
      </table>
      <input type='submit' value='create' />
    </form>
  );
};
export { Blog, BlogForm };