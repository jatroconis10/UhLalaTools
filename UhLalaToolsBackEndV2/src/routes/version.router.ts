import { Router } from 'express';

import { VersionsController } from '../controllers';

const router: Router = Router();

router.get('/', VersionsController.getVersions);

router.get('/:id', VersionsController.getVersion);

router.post('/', VersionsController.createVersion);

export const versionsRouter: Router = router;
