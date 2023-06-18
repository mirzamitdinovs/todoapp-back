const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors());
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const port = 5000;

let todos = [];

app.get('/todos/:status', (req, res) => {
	const { status } = req.params;
	if (status !== 'all') {
		res
			.status(200)
			.json(
				todos.filter((todo) =>
					status === 'completed' ? todo.completed : !todo.completed
				)
			);
	} else {
		res.status(200).json(todos);
	}
});

app.post('/todos', jsonParser, (req, res) => {
	const { title, completed } = req.body;
	const newTodo = {
		id: uuidv4(),
		title: title,
		completed: completed,
		date: new Date(),
	};
	todos.push(newTodo);
	res.status(201).json(newTodo);
});

app.delete('/todos/:id', (req, res) => {
	const { id } = req.params;
	todos = todos.filter((todo) => todo.id != id);
	res.status(200).json('Todo deleted!');
});

app.put('/todos/:id', jsonParser, (req, res) => {
	const { id } = req.params;
	if (!todos.find((todo) => todo.id == id)) {
		res.status(404).json('Todo not found!');
	} else {
		todos = todos.map((todo) => (todo.id == id ? req.body : todo));
		res.status(200).json('Todo Updated!');
	}
});

app.put('/todos/toggle/:id', (req, res) => {
	const { id } = req.params;
	if (!todos.find((todo) => todo.id == id)) {
		res.status(404).json('Todo not found!');
	} else {
		todos = todos.map((todo) =>
			todo.id == id ? { ...todo, completed: !todo.completed } : todo
		);
		res.status(200).json('Todo toggle udpated');
	}
});

app.get('/test', (req, res) => {
	res.json('testing');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
