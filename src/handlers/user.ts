import { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import { createJWT, hashPw, verifyPw } from '../utils/auth';

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const hash = await hashPw(req.body.password);
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: hash,
            },
        });

        const token = createJWT(user);
        res.json(token);
    } catch (err: any) {
        err.type = 'input';
        next(err);
    }
};

export const signIn = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username,
        },
    });

    let isValid = false;

    if (user) {
        isValid = await verifyPw(req.body.password, user?.password);
    }

    if (!isValid) {
        res.status(401);
        res.send('Invalid username or password');
        return;
    }

    const token = createJWT(user!);
    res.json({ token });
};
