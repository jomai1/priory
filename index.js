import express from 'express'
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()


const app = express()
const port = process.env.PORT || 3000;

const tasks_db_path = process.env.TASKS_DB_PATH


function isISO8601Date(dateString) {
	const iso8601Regex = /^(\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?)$/;
	return iso8601Regex.test(dateString);
}

app.use(cors({
    origin: 'http://localhost:8080' // Allow only this origin
}));

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World')
})

app.get('/tasks/v1/all-tasks', (req, res) => {
	let error = []

	try{
		const data = fs.readFileSync(tasks_db_path, { encoding: 'utf8', flag: 'r' });

		if(data.length){
		  res.status(200).send(data)
		}else{
		  res.status(200).send("Currently the database holds no tasks")
		}

	}catch(err){
		
		if (err.code === 'ENOENT') {
  			fs.appendFile(tasks_db_path, '', function (err) {
			  if (err) {
			  	res.status(500).send('Creating DB went wrong.')
			  	throw err;
			  }
			  
			  res.status(200).send("Created DB")
			});

		}else{
			res.status(500).send(`An error occured: ${err}`)
		}
	}
})

app.post('/tasks/v1/create', (req, res) => {
	let error = [];

	if(!req.body.title){
		error.push("missing_title")
	}else if(typeof req.body.title != 'string'){
		error.push("title_not_a_string")
	}

	// TODO: add icon typecheck
	if(!req.body.icon){
		error.push("missing_icon")
	}

	if(!req.body.description){
		error.push("missing_description")
	}else if(typeof req.body.description != 'string'){
		error.push("description_not_a_string")
	}

	if(!Array.isArray(req.body.sub_tasks)){
		error.push("sub_tasks_not_array")
	}else{
		 for (const sub_task of req.body.sub_tasks) {
		    if (sub_task.status != 0) {
		      	error.push("sub_task_status_wrong_format")
		    }else if(typeof sub_task.title != 'string'){
		    	error.push("sub_task_title_wrong_format");
		    }else{
		 		sub_task.id = uuidv4()		    	
		    }
	  }
	}

	if(typeof req.body.deadline != 'string'){
		error.push("deadline_not_a_string");
	}else if (!isISO8601Date(req.body.deadline)) {
    	error.push("deadline_in_wrong_format");
	}
	
	if(!req.body.urgency){
		error.push("missing_urgency")
	}else if(typeof req.body.urgency != 'number'){
		error.push("urgency_not_a_number")
	}else if(req.body.urgency < 0 || req.body.urgency > 5){
		error.push("urgency_out_of_range")
	}
	
	if(!req.body.benefit){
		error.push("missing_benefit")
	}else if(typeof req.body.benefit != 'number'){
		error.push("benefit_not_a_number")
	}else if(req.body.benefit < 0 || req.body.benefit > 5){
		error.push("benefit_out_of_range")
	}

	if(!req.body.effort){
		error.push("missing_effort")
	}else if(typeof req.body.effort != 'number'){
		error.push("effort_not_a_number")
	}else if(req.body.effort < 0 || req.body.effort > 5){
		error.push("effort_out_of_range")
	}

	if(!req.body.cost){
		error.push("missing_cost")
	}else if(typeof req.body.cost != 'number'){
		error.push("cost_not_a_number")
	}else if(req.body.cost < 0 || req.body.cost > 5){
		error.push("cost_out_of_range")
	}

	if(!req.body.time_required){
		error.push("missing_time_required")
	}else if(typeof req.body.time_required != 'number'){
		error.push("time_required_not_a_number")
	}

	if(!Array.isArray(req.body.categories)) {
		error.push("categories_not_array")
	}else{
		for(const category of req.body.categories){
			if (typeof category !== 'string'){
		      	error.push("categories_not_a_sting")
		    }
		}
	}

	if(!Array.isArray(req.body.dependencies)) {
		error.push("dependencies_not_array")
	}else{
		 for (const dep of req.body.dependencies) {
		    if (typeof dep.task_id !== 'string'){
		      	error.push("dependencies_task_id_not_a_sting")
		    }
		    if(!['before', 'no_order', 'after'].includes(dep.type)){
		    	error.push("dependencies_type_wrong_format")
		    }
	  }
	}

	if (error.length > 0) {
		return res.status(400).json({ error });
	}

	const task = {
		id: uuidv4(),
	    title: req.body.title,
	    icon: req.body.icon,
	    description: req.body.description,
	    sub_tasks: req.body.sub_tasks,
	    deadline: req.body.deadline,
	    urgency: req.body.urgency,
	    benefit: req.body.benefit,
	    effort: req.body.effort,
	    cost: req.body.cost,
	    time_required: req.body.time_required,
	    categories: req.body.categories,
	    dependencies: req.body.dependencies,
	}


	try{
		fs.readFile(tasks_db_path, 'utf8', (err, data) => {
			if (err) {
				if (err.code === 'ENOENT') {
					// File doesn't exist, create a new one with an array
					const tasks = [task];
					fs.writeFile(tasks_db_path, JSON.stringify(tasks, null, 2), (err) => {
						if (err) {
						  return res.status(500).send(`Could not save task: ${err}`);
						}
						console.log("You have successfully written a task");
						res.status(200).send("Task created successfully");
					});
				} else {
					return res.status(500).send(`Could not read tasks: ${err}`);
				}
			} else {
				// File exists, append the task to the existing array
				 let tasks = [];
				  if (data) {
				    try {
				      tasks = JSON.parse(data);
				    } catch (e) {
				      return res.status(500).send(`Could not parse tasks: ${e}`);
				    }
				  }
				  
				tasks.push(task);
				fs.writeFile(tasks_db_path, JSON.stringify(tasks, null, 2), (err) => {
					if (err) return res.status(500).send(`Could not save task: ${err}`);

					console.log("You have successfully written a task");
					res.status(200).send("Task created successfully");
				});
			}
		});
	}catch(err){
		res.status(500).send(`Could not save task: ${err}`);
	}
})





app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})  