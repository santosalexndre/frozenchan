import { Request, Response } from 'express';
import { prisma } from '../infra/prisma';
import { Thread } from '../models/thread.model';
import { Post, UserImage } from '../models/post.model';
import { error } from 'console';
import { threadCpuUsage } from 'process';
import { URLSearchParamsIterator } from 'url';
import fs from 'fs/promises';

interface RequestParams {
    board: string;
}
interface ResponseBody {}
interface RequestBody {}
interface RequestQuery {}

export const BoardController = {
    async getBoard(req: Request<RequestParams>, res: Response) {
        const dir = req.params.board;

        const boardList = await prisma.board.findMany();

        const board = await prisma.board.findUnique({
            where: { dir },
            include: {
                Thread: {
                    orderBy: { updatedAt: 'desc' },
                    include: { Post: { take: 5 } },
                },
            },
        });

        if (!board) return res.json({ error: 'nao achei ' });

        return res.render('layout', {
            page: 'board',
            boardList,
            opts: { board, threads: board.Thread },
        });
    },

    async createThread(req: Request, res: Response) {
        console.log(req.body);
        const { subject, name, comment } = req.body;

        let file: UserImage | undefined;
        console.log(req.file);
        if (req.file) {
            const f = req.file;
            const name = req.file.filename.split('.');
            file = {
                ext: name.pop() || '',
                name: name.join(),
                height: 800,
                width: 600,
                size: f.size,
            };
            // const upload = await fs.writeFile(req.file.buffer, );
        }

        console.log(file);
        const thread = await Thread.create('g', subject);

        const post = await Post.create({
            boardDir: 'g',
            comment,
            name,
            threadId: thread.id,
            file,
        });

        res.redirect('/g/');
    },

    async getThread(req: Request, res: Response) {
        const dir = req.params.board;

        const boardList = await prisma.board.findMany();

        const id = req.params.thread;

        if (!id) throw new Error('Not Found');

        const fp = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: { thread: { include: { Post: true } }, board: true },
        });

        if (!fp) throw new Error('Not Found');

        const thread = fp.thread;

        const board = fp.board;

        const threadFp = thread.Post[0]?.id || -1;

        if (fp.id !== threadFp) {
            res.send(404);
            res.end();
            return;
        }

        return res.render('layout', {
            page: 'thread',
            boardList,
            opts: { threadId: thread.id, board, thread, posts: thread.Post },
        });
    },

    async createPost(req: Request, res: Response) {
        // cria post ou thread
        const dir = req.params.board;
        if (!dir) {
            res.send(500);
            throw new Error('What??');
        }

        const threadId = req.params.thread;
        if (!threadId) {
            throw new Error('What');
        }

        const { name, comment } = req.body;

        let file: UserImage | undefined;
        console.log(req.file);
        if (req.file) {
            const f = req.file;
            const name = req.file.filename.split('.');
            file = {
                ext: name.pop() || '',
                name: name.join(),
                height: 800,
                width: 600,
                size: f.size,
            };
            // const upload = await fs.writeFile(req.file.buffer, );
        }

        const post = await prisma.post.create({
            data: {
                ip: '192.168.0.1',
                boardDir: dir,
                threadId: Number(threadId),
                comment,
                name,
                timestamp: new Date(),
                fileheight: file?.height,
                filewidth: file?.width,
                fileName: file?.name,
                filetype: file?.ext,
                filesize: file?.size,
                filePath: 'data/uploads/' + file?.name + file?.ext || '',
            },
            include: {
                thread: {
                    include: {
                        _count: { select: { Post: true } },
                        Post: {
                            take: 1,
                            select: { id: true },
                            orderBy: { id: 'asc' },
                        },
                    },
                },
            },
        });
        // bumpa a thread do post
        await prisma.thread.update({
            where: { id: Number(threadId) },
            data: { updatedAt: new Date() },
        });
        // deleta a thread em ulitmo lugar
        if (post.thread._count.Post > 250) {
            await prisma.thread.delete({ where: { id: Number(threadId) } });
        }

        console.log('dir: ', dir);

        // res.end();
        const fp = post.thread.Post[0]?.id;
        const teste = `/${dir}/thread/${fp}`;
        res.redirect(teste);
    },
};
