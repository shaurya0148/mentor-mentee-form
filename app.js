const express = require('express');
const bodyParser = require('body-parser');
const { connectToMongoDB } = require('./db'); // Adjust the path to your 'db.js' file
const mongoose = require('mongoose');

const app = express();
const port = 3000; // Choose a port of your choice

// Use body-parser middleware and define your Express routes
app.use(bodyParser.urlencoded({ extended: false }));

// Define the Problem model and MongoDB integration here
const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  status: String, // Add a 'status' field to the schema
});

const Problem = mongoose.model('Problem', problemSchema);

// Report a problem route (GET)
app.get('/report-problem', (req, res) => {
  // Render the problem reporting form
  res.send(`
    <html>
      <head>
        <title>Report a Problem</title>
      </head>
      <body>
        <h1>Report a Problem</h1>
        <form action="/report-problem" method="POST">
          <label for="title">Problem Title:</label>
          <input type="text" id="title" name="title" required><br>

          <label for="description">Description:</label>
          <textarea id="description" name="description" rows="4" required></textarea><br>

          <label for="category">Category:</label>
          <select id="category" name="category">
            <option value="bug">Bug</option>
            <option value="feature">Feature Request</option>
            <option value="other">Other</option>
          </select><br>

          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);
});

// Report a problem route (POST)
app.post('/report-problem', async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Create a new problem instance with the provided data
    const problem = new Problem({ title, description, category, status: 'Open' });

    // Save the problem to the database
    await problem.save();

    // Return a success message or redirect to a confirmation page
    // Example: You can redirect to a confirmation page
    // res.redirect('/problem-reported');
    // or send a success message
    res.send('Problem reported and saved successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while saving the problem.');
  }
});

// View problem status route
app.get('/view-problem/:id', async (req, res) => {
  try {
    const problemId = req.params.id;

    // Query the database for the problem with the given ID
    const problem = await Problem.findById(problemId);

    if (!problem) {
      // If the problem doesn't exist, return a 404 error message
      return res.status(404).send('Problem not found');
    }

    // Render the problem status or send it as JSON, depending on your application's needs
    // Here, we send it as JSON
    res.json({ status: problem.status });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching the problem status');
  }
});

// Update problem status route
app.post('/update-problem-status/:id', async (req, res) => {
  try {
    const problemId = req.params.id;
    const newStatus = req.body.status; // Assuming the new status is sent in the request body

    // Query the database for the problem with the given ID
    const problem = await Problem.findById(problemId);

    if (!problem) {
      // If the problem doesn't exist, return a 404 error message
      return res.status(404).send('Problem not found');
    }

    // Check user authentication and authorization here to ensure they have permission to update the status.

    // Update the problem status in the database
    problem.status = newStatus;
    await problem.save();

    // Return a success message
    res.send('Problem status updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while updating the problem status');
  }
});

// Start the MongoDB connection
connectToMongoDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
