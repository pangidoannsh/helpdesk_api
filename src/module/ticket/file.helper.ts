import { extname } from "path";

export const editFileName = (req: any, file: any, callback: any) => {
    try {
        const name: string = file.originalname.split('.')[0];
        const fileExt = extname(file.originalname);

        const randonName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

        callback(null, `${Date.now()}-${randonName}${fileExt}`);
    } catch (e) {
        editFileName(req, file, callback);
    }


}