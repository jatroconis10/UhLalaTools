import { Router } from 'express';

import { WebApplicationsController, E2ETestsController } from '../controllers';

const router: Router = Router();

router.get('/', WebApplicationsController.getWebApplications);

router.get('/:id', WebApplicationsController.getWebApplication);

router.post('/', WebApplicationsController.createWebApplication);

router.patch('/:webApplicationId/e2e-tests/generate-scripts', E2ETestsController.generateE2ETestsScript);

router.patch('/:webApplicationId/e2e-tests/execute-scripts', E2ETestsController.executeE2ETests);

export const webApplicationsRouter: Router = router;
