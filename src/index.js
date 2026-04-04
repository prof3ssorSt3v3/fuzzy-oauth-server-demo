import 'dotenv/config'; //read .env file
import express from 'express'; // Express API
import morgan from 'morgan'; // middleware for logging requests
import cors from 'cors'; //cors middleware to express
import authRouter from './routes/auth.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.status(200).send('Alive and well.');
});

app.use('/api/auth', authRouter);

app.get('/success', (_req, res) => {
  res.send('Success');
});

app.get('/fail', (_req, res) => {
  res.send('Fail');
});

app.use((req, res) => {
  res.status(404).send('What endpoint is that?');
});
const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log(`Listening on port ${PORT}`);
});
