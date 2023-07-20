/* global describe:false, it:false */
import { chai } from '@environment-safe/chai';
import { buildDocs, buildTypes } from '../src/index.mjs';
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import { parse } from "@babel/parser";
import { rimraf } from 'rimraf'
const should = chai.should();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const clearDirectory = async (directory)=>{
    for(const file of await fs.readdir(directory)){
        try{
            const filePath = path.join(directory, file);
            const absPath = path.join(__dirname, '..', directory, file);
            const stats = await fs.lstat(filePath);
            if(stats.isDirectory()) await clearDirectory(filePath);
            await fs.unlink(absPath);
        }catch(ex){ console.log(ex); }
    }
}

describe('module', ()=>{
    describe('performs a simple test suite', ()=>{
        it('loads', async ()=>{
            should.exist({});
        });
        
        it('transforms types', async ()=>{
            await rimraf('./test/output/');
            await buildTypes('./test/example/*.mjs', './test/output/');
            const source = (await fs.readFile('./test/output/sample.d.ts')).toString();
            const ast = parse(source, {
                plugins: [
                    ["typescript", { dts: true }]
                ]
            });
            ast.program.body[0].type.should.equal('TSModuleDeclaration');
            ast.program.body[1].type.should.equal('TSModuleDeclaration');
            const module0Declarations = ast.program.body[0].body.body;
            module0Declarations[0].type.should.equal('TSDeclareFunction');
            console.log(
                module0Declarations[0].id.name,
                module0Declarations[1].id.name,
                module0Declarations[2].id.name
            )
            module0Declarations[0].id.name.should.equal('getX');
            module0Declarations[1].type.should.equal('TSDeclareFunction');
            module0Declarations[1].id.name.should.equal('getY');
            module0Declarations[2].type.should.equal('TSDeclareFunction');
            module0Declarations[2].id.name.should.equal('fromString');
        });
        
        it('transforms docs', async ()=>{
            await buildDocs('./test/example/*.mjs', './test/output/');
        });
    });
});

