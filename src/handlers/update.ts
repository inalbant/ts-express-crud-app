import { Update } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../db';

export const getOneUpdate = async (req: Request, res: Response) => {
    const update = await prisma.update.findUnique({
        where: {
            id: req.params.id,
        },
    });

    res.json({ data: update });
};

export const getUpdates = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        where: {
            belongsToId: req.user.id,
        },
        include: {
            updates: true,
        },
    });

    const updates = products.reduce<Update[]>((allUpdates, product) => {
        return [...allUpdates, ...product.updates];
    }, []);

    res.json({ data: updates });
};

export const createUpdate = async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({
        where: {
            id: req.body.productId,
        },
    });

    if (!product) {
        return res.json({ message: 'no product.. ' });
    }

    console.log('product is: ', product);

    const update = await prisma.update.create({
        data: {
            title: req.body.title,
            body: req.body.body,
            product: { connect: { id: product.id } },
        },
    });

    res.json({ data: update });
};

export const editUpdate = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        where: {
            belongsToId: req.user.id,
        },
        include: {
            updates: true,
        },
    });

    const updates = products.reduce<Update[]>((allUpdates, product) => {
        return [...allUpdates, ...product.updates];
    }, []);

    const match = updates.find((update) => update.id === req.params.id);

    if (!match) return res.json({ message: 'no update..' });

    const updatedUpdate = await prisma.update.update({
        where: {
            id: req.params.id,
        },
        data: req.body,
    });

    res.json({ data: updatedUpdate });
};

export const deleteUpdate = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        where: {
            belongsToId: req.user.id,
        },
        include: {
            updates: true,
        },
    });

    const updates = products.reduce<Update[]>((allUpdates, product) => {
        return [...allUpdates, ...product.updates];
    }, []);

    const match = updates.find((update) => update.id === req.params.id);

    if (!match) return res.json({ message: 'no update..' });

    const deletedUpdate = await prisma.update.delete({
        where: {
            id: req.params.id,
        },
    });

    res.json({ data: deletedUpdate });
};
