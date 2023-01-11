import express, { ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import { createUser, signIn } from './handlers/user';
import { router } from './router';
import { protect } from './utils/auth';

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get('/', (req, res) => {
    res.json({ message: 'hello' });
});

app.use('/api', protect, router);

app.post('/user', createUser);
app.post('/signin', signIn);

app.use(((err, req, res, next) => {
    if (err.type === 'auth') {
        res.status(401).json({ message: 'unauthorised' });
    } else if (err.type === 'input') {
        res.status(400).json({ message: 'invalid input' });
    } else {
        res.status(500).json({ message: 'oops, server died :( ' });
    }
}) as ErrorRequestHandler);
