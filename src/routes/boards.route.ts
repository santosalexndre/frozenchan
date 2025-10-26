import { Router } from 'express';
import { BoardController } from '../controllers/boards.controller';
import path from 'path';
import express from 'express';
import { fileUpload } from '../middlwares/file-upload.middleware';

export const boardRouter = Router();

// const root = path.resolve(__dirname, '..');
// boardRouter.use('/:board/', express.static(path.join(root, 'data', 'uploads')));

boardRouter.get('/:board', BoardController.getBoard);
boardRouter.post('/:board', fileUpload, BoardController.createThread);

boardRouter.get('/:board/thread/:thread', BoardController.getThread);
boardRouter.post(
    '/:board/thread/:thread',
    fileUpload,
    BoardController.createPost,
);

boardRouter.get('/:board/catalog', (req, res) => {
    res.send(req.params.board);
});
