const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
  {
    _id: '62e77f29eb95383200055b20',
    title: 'Pachabel Canonical in String Major',
    author: 'Johann Pachabel',
    url: 'https://en.wikipedia.org/wiki/Pachelbel%27s_Canon',
    likes: 12,
    __v: 0,
  },
];

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });
  const listWithOneBlog = blogs.slice(1, 2);
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
  test('of a bigger list is calculated correctly', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(48);
  });
});

describe('favorite blog', () => {
  test('empty list has no favorites', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBeUndefined();
  });
  const aFewGoodBlogs = blogs.slice(0, -1);
  test('can sort unambiguous blogs', () => {
    const result = listHelper.favoriteBlog(aFewGoodBlogs);
    const dijkstra = { ...blogs[2] };
    delete dijkstra.__v;
    delete dijkstra._id;
    delete dijkstra.url;
    expect(result).toEqual(dijkstra);
  });
  test('can choose a favorite from equals', () => {
    const result = listHelper.favoriteBlog(aFewGoodBlogs);
    const bestTitles = [blogs[2].title, blogs[6].title];
    expect(result).toBeDefined();
    expect(result).toHaveProperty('title');
    expect(bestTitles).toContain(result.title);
  });
});

describe('most blogs written', () => {
  test('no blogs means no authors', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBeUndefined();
  });
  test('works on a list of blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toBeDefined();
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 });
  });
});

describe('most liked author', () => {
  test('no blogs means no likes', () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBeUndefined();
  });
  test('works on a list of blogs', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toBeDefined();
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 });
  });
});
