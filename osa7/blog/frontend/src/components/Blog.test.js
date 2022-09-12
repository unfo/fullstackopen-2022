// import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';

// 5.13: blogilistan testit, step1
// Tee testi, joka varmistaa että blogin näyttävä komponentti renderöi blogin titlen, authorin
// mutta ei renderöi oletusarvoisesti urlia eikä likejen määrää.
describe('5.13: blogilistan testit, step1', () => {
  const likeBlog = jest.fn();
  const removeBlog = jest.fn();
  const currentUser = null;
  const newBlog = {
    title:
      'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
    author: 'Robert Hobart Davis',
    url: 'https://en.wikipedia.org/wiki/How_much_wood_would_a_woodchuck_chuck',
    likes: 42,
  };

  test('<Blog /> renders title and author by default', async () => {
    render(
      <Blog
        blog={newBlog}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
        currentUser={currentUser}
      />
    );
    const elem = screen.queryByText(`${newBlog.title} - ${newBlog.author}`);
    expect(elem).toBeDefined();
  });
  test('<Blog /> does not render url by default', async () => {
    const elem = screen.queryByText(newBlog.url);
    expect(elem).toBeNull();
  });
  test('<Blog /> does not render likes by default', async () => {
    const elem = screen.queryByText(`${newBlog.likes} like(s)`);
    expect(elem).toBeNull();
  });
});

/*
5.14: blogilistan testit, step2
Tee testi, joka varmistaa että myös url ja likejen määrä näytetään
kun blogin kaikki tiedot näyttävää nappia on painettu.
*/

describe('5.14: blogilistan testit, step2', () => {
  const likeBlog = jest.fn();
  const removeBlog = jest.fn();
  const currentUser = null;
  const newBlog = {
    title:
      'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
    author: 'Robert Hobart Davis',
    url: 'https://en.wikipedia.org/wiki/How_much_wood_would_a_woodchuck_chuck',
    likes: 42,
  };
  beforeEach(async () => {
    let { container } = render(
      <Blog
        blog={newBlog}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
        currentUser={currentUser}
      />
    );
    let openDetailsButton = container.querySelector('button.openDetails');
    await userEvent.click(openDetailsButton);
  });
  test('<Blog /> with opened details renders title', async () => {
    const elem = screen.queryByText(newBlog.title);
    expect(elem).toBeDefined();
  });
  test('<Blog /> with opened details renders author', async () => {
    const elem = screen.getByText(newBlog.author);
    expect(elem).toBeDefined();
  });
  test('<Blog /> with opened details renders url', async () => {
    const elem = screen.getByText(newBlog.author);
    expect(elem).toBeDefined();
  });
  test('<Blog /> with opened details renders likes', async () => {
    const elem = screen.getByText(`${newBlog.likes} like(s)`, { exact: false });
    expect(elem).toBeDefined();
  });
});

/*
5.15: blogilistan testit, step3
Tee testi, joka varmistaa, että jos komponentin like-nappia painetaan kahdesti,
komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa.
*/
describe('5.15: blogilistan testit, step3', () => {
  const likeBlog = jest.fn();
  const removeBlog = jest.fn();
  const currentUser = null;
  const newBlog = {
    title:
      'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
    author: 'Robert Hobart Davis',
    url: 'https://en.wikipedia.org/wiki/How_much_wood_would_a_woodchuck_chuck',
    likes: 42,
  };
  let likeButton;
  beforeEach(async () => {
    let { container } = render(
      <Blog
        blog={newBlog}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
        currentUser={currentUser}
      />
    );
    let openDetailsButton = container.querySelector('button.openDetails');
    await userEvent.click(openDetailsButton);
    likeButton = container.querySelector('button.smashThatLikeButton');
  });
  test('like button handler is called', async () => {
    await userEvent.click(likeButton);
    await userEvent.click(likeButton);
    expect(likeBlog.mock.calls).toHaveLength(2);
  });
  test('like button changes like counter', async () => {
    await userEvent.click(likeButton);
    const likeCount = screen.queryByText(`${newBlog.likes + 1} like(s)`);
    expect(likeCount).toBeDefined();
  });
});
