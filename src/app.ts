import express from 'express';
import path from 'path';
import cors from 'cors';
import { boardRouter } from './routes/boards.route';

const port = process.env.PORT || 3000;

const app = express();

const root = path.resolve(__dirname, '..');
app.set('view engine', 'ejs');
app.set('views', path.join(root, 'src', 'views'));
app.use(cors());
app.use(express.static(path.join(root, 'src', 'static')));
app.use(express.urlencoded({ extended: true }));

app.use(boardRouter);

app.get('/', (req, res) => {
    res.render('index', { title: 'Frozen Cham' });
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
