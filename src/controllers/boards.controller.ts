import { Request, Response } from 'express';
import { prisma } from '../infra/prisma';

interface RequestParams {
    board: string;
}
interface ResponseBody {}
interface RequestBody {}
interface RequestQuery {}

export const BoardController = {
    async getBoard(req: Request<RequestParams>, res: Response) {
        const dir = req.params.board;

        const board = await prisma.board.findUnique({
            where: { dir },
            include: { Thread: { include: { Post: true } } },
        });

        if (!board) return res.json({ error: 'nao achei ' });

        return res.render('catalog', { threads: board.Thread });
    },
};
