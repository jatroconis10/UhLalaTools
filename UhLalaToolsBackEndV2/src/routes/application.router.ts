import { Router } from 'express';

import { ApplicationsController } from '../controllers';

const router: Router = Router();

router.get('/', ApplicationsController.getApplications);

router.get('/:id', ApplicationsController.getApplication);

router.post('/', ApplicationsController.createApplication);

export const applicationsRouter: Router = router;
