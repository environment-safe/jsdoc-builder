#!/usr/bin/env node
import { buildDocs, buildTypes } from '../src/index.mjs'
import { join } from 'path';
let action = process.argv[2];
if(!action) throw new Error('No action provided!');
action = action.toLowerCase();
const source = process.argv[3] || './src/*.mjs';
const destination = process.argv[4] || (action === 'docs'?join('.', 'docs'):join('.', 'src') );

(async ()=>{
    switch(action){
        case 'docs':
            //console.log(`Building files in ${source}`);
            await buildDocs(source, destination);
            //console.log(`Built files into ${destination}`);
            break;
        case 'types':
            //console.log(`Building files in ${source}`);
            await buildTypes(source, destination);
            //console.log(`Built files into ${destination}`);
            break;
        case 'add-files':
        
            break;
        default : throw new Error(`unknown action: ${action}`);
    }
})();