const express = require("express");
const app = express();
const bodyParser = require('body-parser'); 
const cors = require('cors');
const path = require('path');
const Authrouter = require('./Routes/AuthRouter');

require('dotenv').config();
require('./models/db');
require('./models/azureblobservice');

const PORT = process.env.PORT || 8080;

// CORS configuration (you might want to customize this)
app.use(cors());

// Body parsing middleware with increased limits
app.use(express.json({ limit: '50mb' })); // For JSON requests
app.use(express.urlencoded({ 
  extended: true,
  limit: '50mb',
  parameterLimit: 100000 // Increase if you expect many URL parameters
}));

// Alternatively, if you're using body-parser explicitly:
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 100000 }));

// Routes
app.use('/auth', Authrouter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});