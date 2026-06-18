import { Router, Request, Response } from "express";

export const blogsRoutes = Router();

blogsRoutes.get('/', (req: Request , res: Response) => {
    res.send('Hello World');
});

blogsRoutes.post('/', (req: Request , res: Response) => {
    res.send('Hello World')
})
