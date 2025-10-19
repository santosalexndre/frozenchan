import express from 'express';
import path from 'path';

const port = process.env.PORT || 3000;

const app = express();

const root = path.resolve(__dirname, '..');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
