const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  let { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = findIndexRepository(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository Not Found!' });
  }

  const repository = {
    id, 
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findIndexRepository(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository Not Found!' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const foundRepository = findRepository(id);

  if (!foundRepository) {
    return response.status(400).json({ error: 'Repository Not Found!' });
  }

  foundRepository.likes += 1

  return response.json(foundRepository);
});

function findIndexRepository(id) {
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  return repositoryIndex;
}

function findRepository(id) {
  const repository = repositories.find(repository => repository.id ===id);

  return repository;
}

module.exports = app;
