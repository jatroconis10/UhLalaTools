import { Router } from 'express';

import { ApplicationsController } from '../controllers';

const router: Router = Router();

router.get('/', ApplicationsController.getApplications);

router.get('/:id', ApplicationsController.getApplication);

router.get('/:id/web-application', ApplicationsController.getWebApplicationFromApplication);

router.get('/:id/mobile-application', ApplicationsController.getWebApplicationFromApplication);

router.post('/', ApplicationsController.createApplication);

export const applicationsRouter: Router = router;
