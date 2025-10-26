import multer from 'multer';

export type AcceptableFormats = 'image' | 'video';
export interface UserUpload {
    fileType: AcceptableFormats;
    extension: string;
    path: string;
    name: string;
    width: number;
    height: number;
    size?: number;
}

const storage = multer.memoryStorage();

const upload = multer({
    dest: 'data/uploads',
    storage,
    fileFilter(req, file, cb) {
        const isImage = file.mimetype.startsWith('image');
        const isVideo = file.mimetype.startsWith('video');
        if (isImage || isVideo) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
});

export const fileUpload = upload.single('image');
