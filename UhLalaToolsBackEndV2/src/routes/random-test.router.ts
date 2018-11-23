import { Router } from 'express';

import { RandomTestsController } from '../controllers';

const router: Router = Router();

router.get('/', RandomTestsController.getRandomTests);

router.get('/by-web-application/:webApplication', RandomTestsController.getRandomTestByWebApplication);

router.get('/:id', RandomTestsController.getRandomTest);

router.get('/:id/errors', RandomTestsController.getRandomTestErrors);

router.patch('/:id/generate-script', RandomTestsController.generateRandomTestScript);

router.patch('/:id/execute', RandomTestsController.executeRandomTest);

router.post('/', RandomTestsController.createRandomTest);

export const randomTestRouter: Router = router;
