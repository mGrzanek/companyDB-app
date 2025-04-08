const Employee = require('./../employee.model');
const Department = require('./../department.model');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Employee', () => {
    before( async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/companyDBtest', {useNewUrlParser: true, useUnifiedTopology: true });
        }
        catch(err) {
            console.error(err);
        }
    });
    describe('Reading data', () => {
        let departmentId;

        before(async() => {
            const testDepOne = new Department({  name: 'Department #1' });
            await testDepOne.save();
            departmentId = testDepOne._id;

            const testEmployeeOne = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: departmentId });
            await testEmployeeOne.save();
        
            const testEmployeeTwo = new Employee({firstName: 'Emilly', lastName: 'Smith', department: departmentId });
            await testEmployeeTwo.save();
        });
        it('should return all the data  with "find" method', async () => {
            const employees = await Employee.find().populate('department');
            for(let employee of employees){
                expect(employee.department.name).to.be.equal('Department #1');
            }
            expect(employees.length).to.be.equal(2);
        });
        it('should return proper document by various params with findOne method', async () => {
            const employee = await Employee.findOne({ firstName: 'Emilly', lastName: 'Smith', department: departmentId }).populate('department');
            expect(employee.firstName).to.be.equal('Emilly');
            expect(employee.lastName).to.be.equal('Smith');
            expect(employee.department.name).to.be.equal('Department #1');
        });
        it('should load the department field with a department object', async () => {
            const employees = await Employee.find().populate('department');
            for (let employee of employees) {
                expect(employee.department).to.be.an('object');
            }
        });
        after(async() => {
            await Employee.deleteMany();
            await Department.deleteMany();
        });
    });
    describe('Creating data', () => {
        it('should insert new document with insertOne method', async () => {
            const newEmployee = new Employee({ firstName: 'Emilly', lastName: 'Smith', department: 'Marketing' });
            await newEmployee.save();
            expect(newEmployee.isNew).to.be.false;
        });
        after(async () => {
            await Employee.deleteMany();
            await Department.deleteMany();
        })
    });
    describe('Updating data', () => {
        beforeEach(async() => {
            const testEmployeeOne = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'IT' });
            await testEmployeeOne.save();
        
            const testEmployeeTwo = new Employee({firstName: 'Emilly', lastName: 'Smith', department: 'Marketing' });
            await testEmployeeTwo.save();
        });
        it('should properly update one document with "updateOne" method', async () => {
            await Employee.updateOne({firstName: 'Amanda', lastName: 'Doe', department: 'IT'}, {$set: { firstName: 'John', lastName: 'Smith', department: 'Testing'}});
            const updatedEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Smith', department: 'Testing' });
            expect(updatedEmployee.firstName).to.be.equal('John');
            expect(updatedEmployee.lastName).to.be.equal('Smith');
            expect(updatedEmployee.department).to.be.equal('Testing');
        }); 
        it('should properly update one document with "save" method', async () => {
            const employee = await Employee.findOne({ firstName: 'Amanda', lastName: 'Doe', department: 'IT' });
            employee.firstName = 'John';
            employee.lastName = 'Smith';
            employee.department = 'Testing';
            await employee.save();
            const updatedEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Smith', department: 'Testing' });
            expect(updatedEmployee).to.not.be.null;
        });
      
        it('should properly update multiple documents with "updateMany" method', async () => {
            await Employee.deleteMany();
            const employees = await Employee.find();
            expect(employees.length).to.be.equal(0);
        });
        afterEach(async() => {
            await Employee.deleteMany();
        });
    });
});