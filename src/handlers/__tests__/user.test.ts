import { Request, Response } from 'express';
import * as user from '../user';

describe('user handler', () => {
    it('can create a new user', async () => {
        const req = {
            body: { username: 'my-username', password: 'password123' },
        };

        const res = {
            json({ token }: { token: string }) {
                expect(token).toBeTruthy();
            },
        };

        await user.createUser(req as Request, res as Response, () => {});
    });
});
