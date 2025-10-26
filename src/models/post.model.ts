import { prisma } from '../infra/prisma';
import {
    AcceptableFormats,
    UserUpload,
} from '../middlwares/file-upload.middleware';

export interface PostDTO {
    threadId: number;
    board: string;
    comment: string;
    name?: string;
    file?: UserUpload;
    thread?: any;
}
export class Post {
    constructor(
        public id: number,
        public threadId: number,
        public boardDir: string,
        public comment: string,
        public timestamp: Date,
        public ipAddress: string,
        public name?: string,
        public file?: UserUpload,
    ) {}

    public static formatFromDb(post: any): Post {
        let file: UserUpload | undefined = undefined;

        if (post.fileName) {
            file = {
                fileType: (post.filetype || 'image') as AcceptableFormats,
                extension: post.filetype || '',
                height: post.fileheight || 0,
                width: post.filewidth || 0,
                name: post.fileName,
                path: post.filePath || '',
                size: post.filesize,
            };
        }

        const ext = post.fileName?.split('');
        return new Post(
            post.id,
            post.threadId,
            post.boardDir,
            post.comment || '',
            post.timestamp,
            post.ip,
            post.name || '',
            file,
        );
    }

    public static async get(id: number) {}

    public static async create(postDto: PostDTO) {}
}
