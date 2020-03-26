import mongoose from 'mongoose';

mongoose
	.connect('mongodb://127.0.0.1:27017/navyget', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Navyget Database connected'));

export default mongoose;
