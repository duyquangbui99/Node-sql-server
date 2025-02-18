const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Import MySQL connection

const app = express();
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the School Management API!');
});

// CRUD Operations for Students (Existing Code)
app.get('/students', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/students/:id', (req, res) => {
    db.query('SELECT * FROM students WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Student not found' });
        res.json(results[0]);
    });
});

app.post('/students', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO students (name, email) VALUES (?, ?)', [name, email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Student added successfully!', id: results.insertId });
    });
});

app.put('/students/:id', (req, res) => {
    const { name, email } = req.body;
    db.query('UPDATE students SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Student updated successfully!' });
    });
});

app.delete('/students/:id', (req, res) => {
    db.query('DELETE FROM students WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Student deleted successfully!' });
    });
});

// CRUD Operations for Courses
app.post('/courses', (req, res) => {
    const { course_name, description } = req.body;
    db.query('INSERT INTO courses (course_name, description) VALUES (?, ?)', [course_name, description], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Course added successfully!', id: results.insertId });
    });
});

app.get('/courses', (req, res) => {
    db.query('SELECT * FROM courses', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/courses/:id', (req, res) => {
    db.query('SELECT * FROM courses WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Course not found' });
        res.json(results[0]);
    });
});

app.put('/courses/:id', (req, res) => {
    const { course_name, description } = req.body;
    db.query('UPDATE courses SET course_name = ?, description = ? WHERE id = ?', [course_name, description, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Course updated successfully!' });
    });
});

app.delete('/courses/:id', (req, res) => {
    db.query('DELETE FROM courses WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Course deleted successfully!' });
    });
});

// Enrollments
app.post('/enrollments', (req, res) => {
    const { student_id, course_id } = req.body;
    db.query('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)', [student_id, course_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Student enrolled successfully!', id: results.insertId });
    });
});

app.get('/courses/:id/students', (req, res) => {
    db.query(`SELECT students.id, students.name, students.email FROM enrollments 
              JOIN students ON enrollments.student_id = students.id 
              WHERE enrollments.course_id = ?`, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/students/:id/courses', (req, res) => {
    db.query(`SELECT courses.id, courses.course_name, courses.description FROM enrollments 
              JOIN courses ON enrollments.course_id = courses.id 
              WHERE enrollments.student_id = ?`, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.delete('/enrollments/:id', (req, res) => {
    db.query('DELETE FROM enrollments WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Student unenrolled successfully!' });
    });
});

// 404 Error Handling
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
