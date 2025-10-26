import sharp from 'sharp';
import {
    AcceptableFormats,
    UserUpload,
} from '../middlwares/file-upload.middleware';
import { v4, v6 } from 'uuid';
import fs from 'fs/promises';

class UserUploadService {
    constructor() {}

    public async saveFile(
        board: string,
        file: Express.Multer.File,
        isThread: boolean,
    ): Promise<UserUpload> {
        const type = file.mimetype.split('/')[0];

        if (!type) throw new Error('Invalid File Format');

        if (type === 'image') {
            const image = sharp(file.buffer);
            const metadata = await image.metadata();
            const parts = file.originalname.split('.');
            const extension = parts.pop();
            if (!extension) {
                throw new Error('ta errado essa merda vai sfude');
            }

            const uid = v4();
            const name = `${uid}.${extension}`;
            const thumbPath = `${board}/${uid}s.webp`;
            const path = `${board}/${uid}.${extension}`;

            await Promise.all([
                fs.writeFile('data/' + path, file.buffer),
                this.createThumbnail(image, metadata, thumbPath, isThread),
            ]);
            console.log(file);
            return {
                extension,
                name: parts.join(''),
                fileType: type as AcceptableFormats,
                width: metadata.width,
                height: metadata.height,
                path,
                size: file.size,
            };
        } else if (type === 'video') {
            throw new Error('Not Implemented Yet');
        } else {
            throw new Error('Invalid File Format');
        }
    }

    public async createThumbnail(
        image: sharp.Sharp,
        metadata: sharp.Metadata,
        path: string,
        isThread: boolean,
    ) {
        let maxWidth = 125;
        let maxHeight = 125;
        const { width, height } = metadata;
        if (height > width) {
            let tmp = maxWidth;
            maxWidth = maxHeight;
            maxHeight = tmp;
        }
        if (isThread) maxWidth *= 3;
        const thumbnail = await image.resize(maxWidth);
        await thumbnail.toFile('data/' + path);
    }
}

export default new UserUploadService();
