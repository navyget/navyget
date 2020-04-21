import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import businessRoutes from './routes/business';
import productsRoutes from './routes/products';
import servicesRoutes from './routes/services';
import mongoose from './db/mongoose';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/navyget-api/v1/auth', authRoutes);
app.use('/navyget-api/v1/business', businessRoutes);
app.use('/navyget-api/v1/product', productsRoutes);
app.use('/navyget-api/v1/service', servicesRoutes);

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
