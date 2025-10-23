import { Router } from 'express';
import { BoardController } from '../controllers/boards.controller';
import path from 'path';
import express from 'express';

export const boardRouter = Router();

import multer from 'multer';
const storage = multer.diskStorage({
    destination(req, file, cb) {
        console.log(req.params.board);
        cb(null, 'data/' + req.params.board);
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    },
});
const upload = multer({
    dest: 'data/uploads',
    storage,
});

// const root = path.resolve(__dirname, '..');
// boardRouter.use('/:board/', express.static(path.join(root, 'data', 'uploads')));

boardRouter.get('/:board', BoardController.getBoard);
boardRouter.post(
    '/:board',
    upload.single('image'),
    BoardController.createThread,
);

boardRouter.get('/:board/thread/:thread', BoardController.getThread);
boardRouter.post(
    '/:board/thread/:thread',
    upload.single('image'),
    BoardController.createPost,
);

boardRouter.get('/:board/catalog', (req, res) => {
    res.send(req.params.board);
});
