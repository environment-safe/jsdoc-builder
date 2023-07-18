import * as fs from 'fs';
import { join } from 'path';
import { render } from 'jsdoc-api';
import { forEachEmission as forEach } from 'async-arrays/async-arrays.mjs';

/**
 * A JSON object
 * @typedef { object } JSON
 */

export const buildDocs = async (source, destination)=>{
    return new Promise((resolve, reject)=>{
        const writtenFiles = [];
        fs.readdir(source, (fileErr, results)=>{
            forEach(results, (file, index, done)=>{
                // do the thing
                done();
            }, ()=>{
                resolve(writtenFiles);
            });
        });
    });
};

export const buildTypes = async (source, destination)=>{
    return new Promise((resolve, reject)=>{
        const writtenFiles = [];
        fs.readdir(source, (fileErr, results)=>{
            forEach(results, (file, index, done)=>{
                // do the thing
                done();
            }, ()=>{
                resolve(writtenFiles);
            });
        });
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