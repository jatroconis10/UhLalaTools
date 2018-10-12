import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send({
        message: 'GET request successfulll!!!!'
    })
});

router.get('/:id', (req: Request, res: Response) => {
});

export const WebApplicationsController: Router = router;
