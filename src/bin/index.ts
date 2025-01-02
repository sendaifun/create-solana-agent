#!/usr/bin/env node
import { log } from '@clack/prompts';
import { main } from '../index.js';

main(process.argv)
  // Pretty log the error, then throw it
  .catch((error: any) => {
    log.error(error);
    throw error;
  });