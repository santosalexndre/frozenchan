import express from 'express';
import path from 'path';
import cors from 'cors';
import { boardRouter } from './routes/boards.route';
import { prisma } from './misc/prisma';

const port = process.env.PORT || 3000;

const app = express();

const root = path.resolve(__dirname, '..');
app.set('view engine', 'ejs');
app.set('views', path.join(root, 'src', 'views'));
app.use(cors());
app.use(express.static(path.join(root, 'data')));
app.use(express.static(path.join(root, 'static')));

app.use(express.urlencoded({ extended: true }));

app.use(boardRouter);

app.get('/', async (req, res) => {
    const boardList = await prisma.board.findMany();
    res.render('index', { boardList, title: 'Frozen Cham' });
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
