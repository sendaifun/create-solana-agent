#!/usr/bin/env node
import { log } from '@clack/prompts';
import { main } from '../index.js';

main(process.argv)
  .catch((error: unknown) => {
    // Type Fix
    const errorMessage = error instanceof Error ? error.message : String(error);
    log.error(errorMessage);
    process.exit(1);
  });