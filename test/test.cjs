const { chai } = require('@environment-safe/chai');
const { } = require('../dist/index.cjs');
const should = chai.should();

describe('module', ()=>{
    describe('performs a simple test suite', ()=>{
        it('loads', async ()=>{
            should.exist({});
        });
    });
});