const express = require('express');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');
const Recipe = require('./models/Recipe');

const app = express();

mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));

// cors prevention headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

// Express no longer needs body-perser for request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// @description: Adds a new recipe
// @route: <domain>/api/recipes
// @method: POST
app.post('/api/recipes', (req, res) => {
	const { title, ingredients, instructions, difficulty, time } = req.body;
	const newRecipe = new Recipe({
		title,
		ingredients,
		instructions,
		difficulty,
		time
	});
	newRecipe
		.save()
		.then(() => {
			res.status(201).json({
				message: 'Post saved successfully!'
			});
		})
		.catch(error => {
			res.status(400).json({
				error: error
			});
		});
});

// @description: returns a specific recipe
// @route: <domain>/api/recipes/<recipe id>
// @method: GET
app.get('/api/recipes/:id', (req, res) => {
	const { id } = req.params;
	Recipe.findById(id)
		.then(recipe => {
			res.status(200).json(recipe);
		})
		.catch(error => {
			res.status(404).json({
				error: error
			});
		});
});

// @description: returns all available recipes
// @route: <domain>/api/recipes
// @method: GET
app.get('/api/recipes', (req, res) => {
	Recipe.find({})
		.then(recipes => {
			res.status(200).json(recipes);
		})
		.catch(error => {
			res.status(400).json({
				error: error
			});
		});
});

// @description: update a recipe by id
// @route: <domain>/api/recipes/<recipe id>
// @method: PUT
app.put('/api/recipes/:id', (req, res) => {
	const { id } = req.params;
	const { title, ingredients, instructions, difficulty, time } = req.body;
	const update = {
		title,
		ingredients,
		instructions,
		difficulty,
		time
	};
	Recipe.findByIdAndUpdate(id, update)
		.then(() => {
			res.status(201).json({
				message: 'Thing updated successfully!'
			});
		})
		.catch(error => {
			res.status(400).json({
				error: error
			});
		});
});

// @description: Delete a recipe
// @route: <domain>/api/recipes/<recipe id>
// @method: DELETE
app.delete('/api/recipes/:id', (req, res) => {
	const { id } = req.params;
	Recipe.findByIdAndDelete(id)
		.then(() => {
			res.status(200).json({
				message: 'Deleted!'
			});
		})
		.catch(error => {
			res.status(400).json({
				error: error
			});
		});
});

module.exports = app;
