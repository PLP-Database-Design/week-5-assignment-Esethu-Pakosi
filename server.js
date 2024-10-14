// Importing necessary modules
const express = require('express');
const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables

const app = express();

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// 1. Retrieve all patients or filter by first name
app.get('/patients', (req, res) => {
  const firstName = req.query.first_name;

  // If a first name is provided, filter by it
  if (firstName) {
    connection.query(
      'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?',
      [firstName],
      (err, results) => {
        if (err) {
          console.error('Error retrieving patients:', err);
          return res.status(500).json({ error: 'Error retrieving patients' });
        }
        return res.json(results);
      }
    );
  } else {
    // Otherwise, retrieve all patients
    connection.query(
      'SELECT patient_id, first_name, last_name, date_of_birth, gender, language FROM patients',
      (err, results) => {
        if (err) {
          console.error('Error retrieving patients:', err);
          return res.status(500).json({ error: 'Error retrieving patients' });
        }
        return res.json(results);
      }
    );
  }
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  connection.query(
    'SELECT first_name, last_name, provider_speciality FROM providers',
    (err, results) => {
      if (err) {
        console.error('Error retrieving providers:', err);
        return res.status(500).json({ error: 'Error retrieving providers' });
      }
      res.json(results);
    }
  );
});

// 3. Endpoint to retrieve providers by their specialty
app.get('/providers/specialty', (req, res) => {
  const { specialty } = req.query; // Get the specialty from the query parameters
  const query = 'SELECT first_name, last_name, provider_speciality FROM providers WHERE provider_speciality = ?';

  connection.query(query, [specialty], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error retrieving providers' });
    }
    return res.json(results);
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
