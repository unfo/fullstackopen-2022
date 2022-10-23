import PropTypes from 'prop-types';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addComment } from '../reducers/blogReducer';

const Blog = ({ blog, likeBlog, removeBlog, currentUser }) => {
  const dispatch = useDispatch();
  const loggedIn = currentUser !== null && currentUser !== undefined;
  const isOwnBlog = loggedIn ? blog.user.username === currentUser : false;

  const like = (event) => {
    event.preventDefault();
    likeBlog(blog.id);
  };

  const deleteBlog = (event) => {
    event.preventDefault();
    if (window.confirm(`Remove [${blog.title}] by [${blog.author}]`)) {
      removeBlog(blog.id);
    }
  };
  const commentOn = async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    await dispatch(addComment(blog, comment));
    event.target.comment.value = '';
  };

  const deleteButton = () => <button onClick={deleteBlog}>delete blog</button>;

  return (
    <Container>
      <h2>
        {blog.title} - {blog.author}
      </h2>
      <p>
        <a href={blog.url}>{blog.url}</a>
      </p>
      <p>
        {blog.likes} like(s) -{' '}
        <button className="smashThatLikeButton" onClick={like}>
          like
        </button>
      </p>
      <p>added by {blog.user.name}</p>
      {isOwnBlog && deleteButton()}
      <h2>Comments</h2>
      <Form onSubmit={commentOn}>
        <Row>
          <Col>
            <Form.Control name="comment" placeholder="New comment ..." />
          </Col>
          <Col>
            <Button variant="primary" type="submit">
              add comment
            </Button>
          </Col>
        </Row>
      </Form>
      <br />
      <Table striped>
        <tbody>
          {blog.comments.map((comment, index) => (
            <tr key={index}>
              <td>{comment}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  currentUser: PropTypes.string,
};

export default Blog;
