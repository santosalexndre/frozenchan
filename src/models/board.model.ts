import { prisma } from '../misc/prisma';
import { Thread } from './thread.model';

export class Board {
    constructor(
        public directory: string,
        public name: string,
        public archive: boolean,
        public postLimit: number,
        public threadsPerPage: number,
        public totalPages: number,
        public threads: Thread[],
    ) {}

    public static formatFromDb(board: any) {
        return new Board(
            board.dir,
            board.name,
            board.archive,
            board.postLimite,
            board.threadsPerPage,
            board.pages,
            board.threads,
        );
    }
}
