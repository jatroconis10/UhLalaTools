import { Router } from 'express';

import { E2ETestsController } from '../controllers';

const router: Router = Router();

router.get('/', E2ETestsController.getE2ETests);

router.get('/:id', E2ETestsController.getE2ETest);

router.post('/', E2ETestsController.createE2ETest);

export const e2eTestsRouter: Router = router;
