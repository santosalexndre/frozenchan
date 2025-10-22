import { Request, Response } from 'express';
import { prisma } from '../infra/prisma';
import { Thread } from '../models/thread.model';
import { Post } from '../models/post.model';

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
            include: {
                Thread: {
                    orderBy: { updatedAt: 'desc' },
                    include: { Post: true },
                },
            },
        });

        if (!board) return res.json({ error: 'nao achei ' });

        return res.render('catalog', { board, threads: board.Thread });
    },

    async createThread(req: Request, res: Response) {
        console.log(req.body);
        const { subject, name, comment, file } = req.body;

        const thread = await Thread.create('g', subject);
        const post = await Post.create({
            boardDir: 'g',
            comment,
            name,
            threadId: thread.id,
        });

        res.redirect('/g/');
    },

    async createPost() {
        // cria post ou thread
        // bumpa a thread do post
        // deleta a thread em ulitmo lugar
    },
};
