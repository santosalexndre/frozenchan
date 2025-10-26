import { prisma } from '../misc/prisma';
import { Board } from './board.model';
import { Post } from './post.model';

export class Thread {
    constructor(
        public id: number,
        public boardDir: string,
        public subject: string,
        public postCount: number,
        public op: Post,
        public posts: Post[],
    ) {}
}
