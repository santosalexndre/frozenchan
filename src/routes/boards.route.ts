import { Router } from 'express';
import { BoardController } from '../controllers/boards.controller';

export const boardRouter = Router();

boardRouter.get('/:board', BoardController.getBoard);

boardRouter.get('/:board/catalog', (req, res) => {
    res.send(req.params.board);
});

boardRouter.get('/:uri/thread/:thread', (req, res) => {});
