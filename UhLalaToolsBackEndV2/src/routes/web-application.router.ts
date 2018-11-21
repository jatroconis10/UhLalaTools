import { Router } from 'express';

import { WebApplicationsController } from '../controllers';

const router: Router = Router();

router.get('/', WebApplicationsController.getWebApplications);

router.get('/:id', WebApplicationsController.getWebApplication);

router.post('/', WebApplicationsController.createWebApplication);

export const webApplicationsRouter: Router = router;
