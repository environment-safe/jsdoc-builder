import * as fs from 'fs';
import * as url from 'url';
import { join, basename } from 'path';
import { forEachEmission as forEach } from 'async-arrays/async-arrays.mjs';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { exec } from 'node:child_process';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';

//TODO: inspect the dir to see if it's a symlink to detect link 
//      and change binary locations
const binary = './node_modules/.bin/jsdoc';
// use this when linked (thanks for the shit design, npm!)
//const binary = './node_modules/@environment-safe/jsdoc-builder/node_modules/.bin/jsdoc';


const runJSDocTypes = async (type, pattern, destination)=>{
    const files = await glob(pattern, { ignore: 'node_modules/**' });
    let file = null;
    try{
        for(let lcv=0; lcv< files.length; lcv++){
            file = files[lcv];
            const dest = join(process.cwd(), destination)
            const command = `${binary} -c "${
                join(__dirname, '..', `${type}-config.json`)
            }" -d "${
                dest[0] === '/'?dest:join(dest[0] === __dirname, '..', `${dest}`)
            }" "${file}"`;
            await new Promise((resolveExec, rejectExec)=>{
                exec(command, (error, stdout, stderr) => {
                    if(error) return resolveExec(error);
                    if(stderr) return rejectExec(stderr);
                    resolveExec(stdout);
                }); 
            });
            await new Promise((resolve, reject)=>{
                fs.stat(
                    join(dest, 'types.d.ts'),
                    (error, stats)=>{
                        if(error) return reject(error);
                        resolve();
                    }
                )
            });
            await new Promise((resolve, reject)=>{
                fs.rename(
                    join(dest, 'types.d.ts'),
                    join(dest, basename(file).replace('.mjs', '.d.ts')),
                    (error)=>{
                        if(error) return reject(error);
                        resolve();
                    }
                )
            });
        }
    }catch(ex){
        console.log(`FATAL when processing: ${file}`, ex)
    }
};

const runJSDocDocs = async (type, pattern, destination)=>{
    const files = await glob(pattern, { ignore: 'node_modules/**' });
    let file = null;
    for(let lcv=0; lcv< files.length; lcv++){
        file = files[lcv];
        const dest = join(process.cwd(), destination)
        const command = `${binary} -c "${
            join(__dirname, '..', `${type}-config.json`)
        }" -d "${
            dest[0] === '/'?dest:join(dest[0] === __dirname, '..', `${dest}`)
        }" "${file}"`;
        
        await new Promise((resolveExec, rejectExec)=>{
            exec(command, (error, stdout, stderr) => {
                if(error) return rejectExec(error);
                if(stderr) return rejectExec(stderr);
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