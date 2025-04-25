const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); // Create an 'uploads' folder if not exists
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Use unique name with extension
    }
  });
  
  const upload = multer({ storage: storage });

const app = express();

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // ⚠️ replace with your MySQL username
  password: 'Deepak@2002',         // ⚠️ replace with your MySQL password
  database: 'register'
});

// Connect to DB
db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});


app.get('/candidate-dashboard', (req, res) => {
res.sendFile(path.join(__dirname, 'public/candidate-dashboard.html'));
});

app.get('/employer-dashboard', (req, res) => {
res.sendFile(path.join(__dirname, 'public/employer-dashboard.html'));
});
  

// Register handler
app.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;
  
    const sql = 'INSERT INTO register (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, password, role], (err, result) => {
      if (err) {
        console.error('❌ Error inserting user:', err);
        return res.status(500).send('Registration failed.');
      }
      res.redirect('/login');
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM register WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
      if (err) {
        console.error('❌ Login error:', err);
        return res.status(500).send('Login failed.');
      }
      if (results.length === 0) {
        return res.send('❌ Invalid email or password.');
      }
      const user = results[0];
      if (user.role === 'candidate') {
        return res.redirect('/candidate-dashboard');
      } else if (user.role === 'employer') {
        return res.redirect('/employer-dashboard');
      } else {
        return res.send('⚠️ Unknown user role.');
      }
    });
});
 
app.post('/employer/update-profile', upload.single('profilePic'), (req, res) => {
    const { name, designation, department, email, contact } = req.body;
    const profilePic = req.file ? req.file.filename : null;
  
    // Save to database here...
    res.send("Profile updated successfully!");
  });
  

// Start server
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
