import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'public';

export const PUBLIC = () => SetMetadata(PUBLIC_KEY, true);