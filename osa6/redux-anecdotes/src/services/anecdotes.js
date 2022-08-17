import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  console.log('anecdotesService.getAll()');
  const response = await axios.get(baseUrl);
  console.log('Got ', response.data.length);
  return response.data;
};

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const createNew = async (content) => {
  const object = { content, votes: 0 };
  const response = await axios.post(baseUrl, object);
  return response.data;
};

const update = async (id, updatedItem) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedItem);
  return response.data;
};

const anecdotesService = { getAll, getById, createNew, update };
export default anecdotesService;