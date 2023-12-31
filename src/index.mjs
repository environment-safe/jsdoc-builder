import * as fs from 'fs';
import * as url from 'url';
import { join, basename } from 'path';
import { forEachEmission as forEach } from 'async-arrays/async-arrays.mjs';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { exec } from 'node:child_process';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';

const runJSDocTypes = async (type, pattern, destination)=>{
    const files = await glob(pattern, { ignore: 'node_modules/**' });
    let file = null;
    for(let lcv=0; lcv< files.length; lcv++){
        file = files[lcv];
        const command = `./node_modules/.bin/jsdoc -c "${
            join(__dirname, '..', `${type}-config.json`)
        }" -d "${
            join(__dirname, '..', `${destination}`)
        }" "${file}"`;
        await new Promise((resolveExec)=>{
            exec(command, (error, stdout, stderr) => {
                if(error) return reject(error);
                if(stderr) return reject(stderr);
                resolveExec(stdout);
            }); 
        });
        await new Promise((resolveExec)=>{
            fs.rename(
                join(__dirname, '..', destination, 'types.d.ts'),
                join(__dirname, '..', destination, basename(file).replace('.mjs', '.d.ts')),
                (error)=>{
                    if(error) return reject(error);
                    resolveExec();
                }
            )
        });
    }
};

const runJSDocDocs = async (type, pattern, destination)=>{
    const files = await glob(pattern, { ignore: 'node_modules/**' });
    let file = null;
    for(let lcv=0; lcv< files.length; lcv++){
        file = files[lcv];
        const command = `./node_modules/.bin/jsdoc -c "${
            join(__dirname, '..', `${type}-config.json`)
        }" -d "${
            join(__dirname, '..', `${destination}`)
        }" "${file}"`;
        
        await new Promise((resolveExec)=>{
            exec(command, (error, stdout, stderr) => {
                if(error) return reject(error);
                if(stderr) return reject(stderr);
                resolveExec(stdout);
            }); 
        });
    }
};

const runJSDoc = async (type='', pattern, destination)=>{
    switch(type.toLowerCase()){
        case 'types' : return await runJSDocTypes(type, pattern, destination);
        case 'docs' : return await runJSDocDocs(type, pattern, destination);
        default : throw new Error(`Unknown type: ${type}`);
    }
};


/**
 * Build type files as described in the source directory glob into the destination directory
 * @function
 * @async
 * @param {string} source - A glob pattern which describes the input files.
 * @param {string} destination - The directory to write output files into.
 */
export const buildTypes = (source, destination)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            const result = await runJSDoc('types', source, destination);
            resolve(result);
        }catch(ex){
            reject(ex);
        }
    });
};

/**
 * Build type files as described in the source directory glob into the destination directory
 * @function
 * @async
 * @param {string} source - A glob pattern which describes the input files.
 * @param {string} destination - The directory to write output files into.
 */
export const buildDocs = (source, destination)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            const result = await runJSDoc('docs', source, destination);
            resolve(result);
        }catch(ex){
            reject(ex);
        }
    });
};