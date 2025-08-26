require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const sevasRoutes = require('./routes/sevas');
const usersRoutes = require('./routes/users');
const addressRoutes = require('./routes/address');
const ordersRoutes = require('./routes/order');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/sevas', sevasRoutes);
app.use('/api/users', usersRoutes);
app.use('/api', addressRoutes);
app.use('/api/order', ordersRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});