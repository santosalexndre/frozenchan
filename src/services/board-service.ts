import { prisma } from '../misc/prisma';
import { UserUpload } from '../middlwares/file-upload.middleware';
import { Board } from '../models/board.model';
import { Post, PostDTO } from '../models/post.model';
import { Thread } from '../models/thread.model';

const boardList: string[] = [];
const threadsPerPage: number = 10;
const postsPerThread: number = 5;

export async function getBoardList(): Promise<string[]> {
    if (boardList.length > 0) return boardList;
    boardList.push(...(await prisma.board.findMany()).map((b) => b.dir));
    return boardList;
}

async function fetchThreads(board: string, page: number) {
    const b = await prisma.board.findFirst({
        where: { dir: board },
        include: {
            Thread: {
                orderBy: { updatedAt: 'desc' },
                take: threadsPerPage,
                skip: page * threadsPerPage,
                include: {
                    firstPost: true,
                    Post: {
                        take: postsPerThread + 1,
                        orderBy: { timestamp: 'desc' },
                    },
                    _count: { select: { Post: true } },
                },
            },
        },
    });

    if (!b) {
        throw new Error('NotFound');
    }

    return b;
}

function formatThreads(threads: any, board: string): Thread[] {
    return threads.map((t: any) => {
        const posts = t.Post.reverse().map((p: any) => Post.formatFromDb(p));
        const fp = Post.formatFromDb(t.firstPost);
        return new Thread(t.id, board, t.subject, t._count.Post, fp, posts);
    });
}

export async function getPage(board: string, page: number): Promise<Board> {
    const b = await fetchThreads(board, page);
    const threads = formatThreads(b.Thread, board);

    return new Board(
        board,
        b.name,
        b.archive,
        b.postLimite,
        b.threadsPerPage,
        69420,
        threads,
    );
}

export async function createThread(
    board: string,
    comment: string,
    subject: string = '',
    name: string = '',
    file?: UserUpload,
): Promise<any> {
    const thread = await prisma.thread.create({
        data: {
            subject,
            boardDir: board,
        },
    });

    const post = await createPost({
        board,
        comment,
        name,
        threadId: thread.id,
        thread,
        file,
    });

    await prisma.thread.update({
        where: { id: thread.id },
        data: { firstPostId: post.id },
    });
    return thread;
}

export async function getThread(id: number): Promise<Thread> {
    const thread = await prisma.thread.findFirst({
        where: { firstPostId: id },
        include: { Post: true, board: true },
    });

    if (!thread) throw new Error('NotFound');

    return new Thread(
        thread.id,
        thread.boardDir,
        thread.subject,
        -1,
        Post.formatFromDb(thread.Post[0]),
        thread.Post.map((p) => Post.formatFromDb(p)),
    );
}

export async function createPost(postDto: PostDTO) {
    try {
        const post = await prisma.post.create({
            data: {
                ip: '192.168.0.1',
                boardDir: postDto.board,
                comment: postDto.comment,
                threadId: postDto.threadId,
                name: postDto.name,
                timestamp: new Date(),
                filewidth: postDto.file?.width,
                fileheight: postDto.file?.height,
                fileName: postDto.file?.name,
                filetype: postDto.file?.extension,
                filePath: postDto.file?.path,
                filesize: postDto.file?.size,
            },
        });
        return post;
    } catch (e) {
        throw new Error('Something went wrong i guess');
    }
}
