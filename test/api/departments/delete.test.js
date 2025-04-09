const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../../../server');
const Department = require('./../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE api/departments', () => {
    before(async() => {
        const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
        await testDepOne.save();
        
        const testDepTwo = new Department({ _id: '5d9f1159f81ce8d1ef2bee48', name: 'Department #2' });
        await testDepTwo.save();
    });
    it('/:id should remove chosen document and return success', async () => {
        const res = await request(server).delete('/api/departments/5d9f1140f10a81216cfd4408');
        const removedDepartment = await Department.findOne({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
        const notRemovedDepartent = await Department.findOne({ _id: '5d9f1159f81ce8d1ef2bee48', name: 'Department #2' });
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.be.equal('Department #1');
        expect(removedDepartment).to.be.null;
        expect(notRemovedDepartent).to.not.be.null;
    });
    after(async() => {
        await Department.deleteMany();
    });
});