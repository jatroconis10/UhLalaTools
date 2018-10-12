import { Router } from 'express';

import { WebApplicationsController } from '../controllers/web-applications/web-applications.controller';

const router: Router = Router();

router.get('/', WebApplicationsController.getWebApplications);

router.get('/:id', WebApplicationsController.getWebApplication);

router.post('/', WebApplicationsController.createWebApplication);

export const webApplicationsRouter: Router = router;
