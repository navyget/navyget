import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
