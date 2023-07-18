#!/usr/bin/env node
import { buildDocs, buildTypes, addFiles } from '../src/index.mjs'
import { join } from 'path';
let action = process.argv[2];
if(!action) throw new Error('No action provided!');
action = action.toLowerCase();
const source = process.argv[2] || './src';
const destination = process.argv[3] || (action === 'docs'?'./docs':'./src' );

switch(action){
    case 'docs':
    
        break;
    case 'types':
    
        break;
    case 'add-files':
    
        break;
    default : throw new Error(`unknown action: ${action}`);
}