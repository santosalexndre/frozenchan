import { prisma } from '../infra/prisma';

export class Board {
    private constructor(
        public directory: string,
        public name: string,
        public archive: boolean,
        public postLimit: number,
        public threadsPerPage: number,
        public totalPages: number,
    ) {}

    public static async get(dir: string): Promise<Board> {
        const board = await prisma.board.findUnique({ where: { dir } });
        if (!board) throw new Error(`Board: ${dir} Not Found`);

        return new Board(
            board.dir,
            board.name,
            board.archive,
            board.postLimite,
            board.threadsPerPage,
            board.pages,
        );
    }
}
