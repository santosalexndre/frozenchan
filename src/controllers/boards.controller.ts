import { Request, Response } from 'express';
import { prisma } from '../misc/prisma';
import userUploadService from '../services/user-upload.service';
import { Board } from '../models/board.model';
import {
    createPost,
    createThread,
    getBoardList,
    getPage,
    getThread,
} from '../services/board-service';
import { formatDate } from '../misc/presentation';
import { Post } from '../models/post.model';

interface RequestParams {
    board: string;
}
interface ResponseBody {}
interface RequestBody {}
interface RequestQuery {}

const mapper = (p: Post) => {
    const path = p.file?.path.replace(/(\.[^.]*)$/, 's.webp') || '';

    let fileInfo = '';
    let fileSize = '';
    if (p.file) {
        const f = p.file;
        const kbs = (p.file.size || 0) / 1024;
        fileSize = `${kbs.toFixed(1)} KB`;
        if (kbs > 1024) {
            const mbs = kbs / 1024;
            fileSize = `${mbs.toFixed(1)} MB`;
        }

        fileInfo = `(${f.width}x${f.height}, ${fileSize})`;
    }

    let fileName = undefined;
    if (p.file) {
        const name = p.file!.name + '.' + p.file!.extension;
        const dotIndex = name.lastIndexOf('.');
        const fname = name.slice(0, dotIndex);
        const ext = name.slice(dotIndex);
        if (fname.length >= 64) {
            fileName = fname.slice(0, 64) + '(...)' + ext;
        } else {
            fileName = name;
        }
    }

    return {
        id: p.id,
        ip: p.ipAddress,
        comment: p.comment,
        name: p.name,
        thumbnailPath: path,
        date: formatDate(p.timestamp),
        fileInfo,
        fileName,
        file: p.file,
    };
};
export const BoardController = {
    async getBoard(req: Request<RequestParams>, res: Response) {
        try {
            const directory = req.params.board;
            const board = await getPage(directory, 0);
            const boardList = await getBoardList();

            const boardName = board.name;

            const threads = board.threads.map((t) => ({
                ...t,
                op: mapper(t.op),
                posts: t.posts.map(mapper),
            }));

            return res.render('layout', {
                page: 'board',
                boardList,
                boardName,
                directory,
                opts: {
                    threads,
                },
            });
        } catch (e) {
            console.log(e);
            res.redirect('/');
        }
    },

    async createThread(req: Request, res: Response) {
        try {
            const board = req.params.board;
            if (!board) throw new Error('Board not found');
            const { subject, name, comment } = req.body;

            if (!comment || comment.length <= 0) {
                throw new Error('A comment is required');
            }

            const file = req.file
                ? await userUploadService.saveFile(board, req.file, true)
                : undefined;

            const thread = await createThread(
                board,
                comment,
                subject,
                name,
                file,
            );

            res.redirect(`/${board}/`);
        } catch (e) {
            console.log(e);
            res.redirect('/');
        }
    },

    async getThread(req: Request, res: Response) {
        const id = req.params.thread;
        if (!id) throw new Error('Not Found');

        const t = await getThread(Number(id));
        const thread = {
            ...t,
            op: mapper(t.op),
            posts: t.posts.map((p) => mapper(p)),
        };

        const board = Board.formatFromDb(
            await prisma.board.findUnique({ where: { dir: req.params.board } }),
        );

        return res.render('layout', {
            page: 'thread',
            boardList: await getBoardList(),
            boardName: board.name,
            directory: board.directory,
            opts: {
                thread,
            },
        });
    },

    async createPost(req: Request, res: Response) {
        console.log('CRIANO POST');
        const board = req.params.board;
        if (!board) {
            res.send(500);
            throw new Error('What??');
        }
        const threadId = req.params.thread;
        if (!threadId) {
            throw new Error('What');
        }
        const { name, comment } = req.body;

        const file = req.file
            ? await userUploadService.saveFile(board, req.file, false)
            : undefined;

        const post = await createPost({
            board,
            comment,
            name,
            threadId: Number(threadId),
            file,
        });

        // bumpa a thread do post
        const thread = await prisma.thread.update({
            where: { id: Number(threadId) },
            data: { updatedAt: new Date() },
            include: { _count: { select: { Post: true } } },
        });
        // deleta a thread em ulitmo lugar
        if (thread._count.Post > 250) {
            await prisma.thread.delete({ where: { id: Number(threadId) } });
        }
        const fp = thread.firstPostId;
        const teste = `/${board}/thread/${fp}`;
        res.redirect(teste);
    },
};
