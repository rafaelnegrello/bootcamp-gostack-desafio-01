const express = require('express')
const server = express();

server.use(express.json());

const projects = [ ];
let requests = 0;

server.use((req, res, next) => {
  console.log(`Total de requisições: ${++requests}`);

  next();
});

function checkProjectExists(req, res, next){
  const project = projects.find(p => p.id == req.params.id);
  
  if(!project){
    return res.status(400).json({error: 'Project not found!'})
  }

  req.project = project;

  return next();
}

function checkProjectDuplicate(req, res, next){
  const project = projects.find(p => p.id == req.body.id);
  
  if(project){
    return res.status(400).json({error: 'Existing project!'})
  }

  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', checkProjectExists, (req, res) => {
  return res.json(req.project);
});

server.post('/projects', checkProjectDuplicate, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  var project = req.project;

  project.tasks.push(title);

  return res.json(project);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body;
  
  var project = req.project;
 
  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { index } = req.params;

  projects.splice(index, 1);
  
  return res.send();
});

server.listen(3000);