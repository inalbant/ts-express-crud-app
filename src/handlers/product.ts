import { Request, Response } from 'express';
import prisma from '../db';

export const getProducts = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user?.id,
        },
        include: {
            products: true,
        },
    });

    res.json({ data: user?.products });
};

export const getOneProduct = async (req: Request, res: Response) => {
    const prodId = req.params.id;

    const product = await prisma.product.findFirst({
        where: {
            id: prodId,
            belongsToId: req.user?.id,
        },
    });

    res.json({ data: product });
};

export const createProduct = async (req: Request, res: Response) => {
    const product = await prisma.product.create({
        data: {
            name: req.body.name,
            belongsToId: req.user.id,
        },
    });

    res.json({ data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
    const updatedProd = await prisma.product.update({
        where: {
            id_belongsToId: {
                id: req.params.id,
                belongsToId: req.user.id,
            },
        },
        data: {
            name: req.body.name,
        },
    });

    res.json({ data: updatedProd });
};

export const deleteProduct = async (req: Request, res: Response) => {
    const deletedProd = await prisma.product.delete({
        where: {
            id_belongsToId: {
                id: req.params.id,
                belongsToId: req.user.id,
            },
        },
    });

    res.json({ data: deletedProd });
};
