import main from 'main';

import { logger } from '@/utils/logger';

main().catch((err) => logger.error(err));
