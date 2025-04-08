const Employee = require('./../employee.model');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Employee', () => {
    it('should throw an error if args empty', () => {
        const empl = new Employee({});
        empl.validateSync(err => {
            expect(err.errors.firstName).to.exist;
            expect(err.errors.lastName).to.exist;
            expect(err.errors.department).to.exist;
        });
    });
    it('should throw an error if args are not a string', () => {
        const cases = [{}, []];
        for(let data of cases){
            const empl = new Employee({ firstName: data, lastName: data, department: data });
            empl.validateSync(err => {
                expect(err.errors.firstName).to.exist;
                expect(err.errors.lastName).to.exist;
                expect(err.errors.department).to.exist;
            });
        }
    });
    it('should return new employee if good args', () => {
        const cases = [
            {firstName: 'Emilly', lastName: 'Doe', department: 'Managment'},
            {firstName: 'Amanda', lastName: 'Smith', department: 'Production'},
            {firstName: 'Harry', lastName: 'Doe', department: 'Managment'},
        ];
        for(let data of cases){
            const empl = new Employee({ firstName: data.firstName, lastName: data.lastName, department: data.department });
            empl.validateSync(err => {
                expect(err.errors.firstName).to.not.exist;
                expect(err.errors.lastName).to.not.exist;
                expect(err.errors.department).to.not.exist;
            });
        }
    });
    after(() => {
        mongoose.models = {};
    });
});