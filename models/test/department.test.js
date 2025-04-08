const Department = require('./../department.model');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Department', () => {
    it('should throw an error if no "name" arg', () => {
        const dep = new Department({}); 
        dep.validateSync(err => {
            expect(err.errors.name).to.exist;
        });
    });
    it('should throw an error if "name" is not a string', () => {
        const cases = [{}, []];
        for(let name of cases) {
          const dep = new Department({ name });
          dep.validateSync(err => {
            expect(err.errors.name).to.exist;
          });
        }
    });
    it('should throw an error if "name" lenght is is too short or too long', () => {
        const cases = ['PR', 'Strategic Planning and Analysis', 'HR', 'Business Process Optimization Team'];
        for(let name of cases){
            const dep = new Department({ name });
            dep.validateSync(err => {
                expect(err.errors.name).to.exist;
            });
        }
    });
    it('should return new department if good attribute', () => {
        const cases = ['Finance', 'Logistics', 'Support', 'Operations'];
        for(let name of cases){
            const dep = new Department({ name });
            dep.validateSync(err => {
                expect(err.errors.name).to.not.exist;
            });
        }
    });
});