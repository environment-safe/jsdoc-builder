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
        
        console.log(command);
        await new Promise((resolveExec)=>{
            exec(command, (error, stdout, stderr) => {
                if(error) return reject(error);
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                resolveExec();
                console.log()
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
}

const runJSDoc = async (type='', pattern, destination)=>{
    console.log('TYPE', type)
    switch(type.toLowerCase()){
        case 'types' : return await runJSDocTypes(type, pattern, destination);
        case 'docs' : return await runJSDocDocs(type, pattern, destination);
        default : throw new Error(`Unknown type: ${type}`);
    }
}

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
        
        console.log(command);
        await new Promise((resolveExec)=>{
            exec(command, (error, stdout, stderr) => {
                if(error) return reject(error);
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                resolveExec();
                console.log()
            }); 
        });
        /*await new Promise((resolveExec)=>{
            fs.rename(
                join(__dirname, '..', destination, 'types.d.ts'),
                join(__dirname, '..', destination, basename(file).replace('.mjs', '.d.ts')),
                (error)=>{
                    if(error) return reject(error);
                    resolveExec();
                }
            )
        });*/
    }
}

/**
 * A JSON object
 * @typedef { object } JSON
 */
 
const runJSDocWithConfig = async (type, files, destination)=>{
    const options = {
        configure: join(__dirname, '..', `${type}-config.json`),
        files: join(__dirname, '..', files),
        destination: (
            destination === 'console'?
                'console':
                join(__dirname, '..', destination)
        )
    };
    console.log(options);
    const code = jsdoc.renderSync(options);
    console.log('>>>', code, options);
    return code;
};


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

export const addFiles = async (modes)=>{
    return new Promise((resolve, reject)=>{
        forEach(modes, (file, index, done)=>{
            // do the thing
            done();
        }, ()=>{
            resolve(writtenFiles);
        });
    });
};