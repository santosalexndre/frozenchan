import { prisma } from '../infra/prisma';

export interface PostDTO {
    threadId: number;
    boardDir: string;
    comment: string;
    name?: string;
}
export class Post {
    private constructor(
        public id: number,
        public threadId: number,
        public boardDir: string,
        public comment: string,
        public timestamp: Date,
        public ipAddress: string,
        public name?: string,
        public fileName?: string,
    ) {}

    public static async get(id: number) {}

    public static async create(postDto: PostDTO) {
        try {
            const post = await prisma.post.create({
                data: {
                    ip: '192.168.0.1',
                    boardDir: postDto.boardDir,
                    comment: postDto.comment,
                    threadId: postDto.threadId,
                    name: postDto.name,
                    timestamp: new Date(),
                },
            });
            return post;
        } catch (e) {
            console.log(e);
            throw new Error('Something went wrong i guess');
        }
    }
}
