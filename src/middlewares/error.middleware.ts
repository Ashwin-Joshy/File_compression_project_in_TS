import { NextFunction, Request, Response } from 'express';
import HttpExceptionError from '../utils/exceptions/http.exception';

function errorMiddleware(
    err: HttpExceptionError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(err.status || 500).json({ message: err.message });
}

export default errorMiddleware;
