import { prisma } from '../infra/prisma';

export class Thread {
    private constructor(
        public id: number,
        public boardDir: string,
        public subject: string,
    ) {}

    public static async get() {}
    public static async create(boardDir: string, subject: string) {
        const thread = prisma.thread.create({ data: { subject, boardDir } });
        return thread;
    }
}
