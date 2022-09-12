import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

/*
Tee uuden blogin luomisesta huolehtivalle lomakkelle testi, joka varmistaa,
että lomake kutsuu propsina saamaansa takaisinkutsufunktiota oikeilla tiedoilla
siinä vaiheessa kun blogi luodaan.
*/
describe('5.16: blogilistan testit, step4', () => {
  test('createBlog callback is called with correct details', async () => {
    const createBlog = jest.fn();
    const { container } = render(<BlogForm createBlog={createBlog} />);
    const newBlog = {
      title:
        'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
      author: 'Robert Hobart Davis',
      url: 'https://en.wikipedia.org/wiki/How_much_wood_would_a_woodchuck_chuck',
    };
    const user = userEvent.setup();
    const inputs = screen.getAllByRole('textbox');
    for (const input of inputs) {
      const name = input.name;
      const value = newBlog[name];
      await user.type(input, value);
    }
    const submit = container.querySelector('input.submitButton');
    await user.click(submit);
    expect(createBlog.mock.calls).toHaveLength(1);
    const formData = createBlog.mock.calls[0][0];
    expect(formData.title).toBe(newBlog.title);
    expect(formData.author).toBe(newBlog.author);
    expect(formData.url).toBe(newBlog.url);
  });
});
