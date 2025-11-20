const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const activitiesRoutes = require('./routes/activities');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/activities', activitiesRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

(async () => { await db.init(); })();

app.listen(PORT, () => console.log("Server running on " + PORT));
