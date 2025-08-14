import { Response } from 'express';

class HttpStatus {
    successResponse(data: any, res: Response) {
        return res.status(200).json({
            code: 200,
            status: "success",
            data: data
        });
    }

    errorResponse(e: { code?: number; message?: string }, res: Response) {
        const errorObj: { code?: number; message?: string } = {};
        errorObj.code = e.code;
        errorObj.message = process.env.ENVIRONMENT === 'production'
            ? "Something went Wrong!! Please Contact administrator for more details"
            : e.message;
        return res.status(500).json({ error: { errors: errorObj } });
    }

    invalidInputResponse(data: any, res: Response) {
        return res.status(400).json({ error: data });
    }
}

export default new HttpStatus();
