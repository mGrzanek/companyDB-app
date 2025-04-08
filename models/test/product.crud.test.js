const Product = require('./../products.model');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Product', () => {
    before( async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/companyDBtest', {useNewUrlParser: true, useUnifiedTopology: true });
        }
        catch(err) {
            console.error(err);
        }
    });
    describe('Reading data', () => {
        before(async() => {
            const testProductOne = new Product({ name: 'Name #1', client: 'Client #1' });
            await testProductOne.save();
        
            const testProductTwo = new Product({ name: 'Name #2', client: 'Client #2' });
            await testProductTwo.save();
        });
        it('should return all the data  with "find" method', async () => {
            const products = await Product.find();
            const expectedLength = 2;
            expect(products.length).to.be.equal(expectedLength);
        });
        it('should proper document by "name" with "findOne" method', async () => {
            const product = await Product.findOne({ name: 'Name #2', client: 'Client #2' });
            const expectedName = 'Name #2';
            const expectedClient = 'Client #2';
            expect(product.name).to.be.equal(expectedName);
            expect(product.client).to.be.equal(expectedClient);
        });
        after(async() => {
            await Product.deleteMany();
        });
    });
    describe('Creating data', () => {
        it('should insert new document with "insertOne" method', async () => {
            const newProduct = new Product({  name: 'Name #1', client: 'Client #1' });
            await newProduct.save();
            expect(newProduct.isNew).to.be.false;
        });
        after(async() => {
            await Product.deleteMany();
        });
    });
    describe('Updating data', () => {
        beforeEach(async() => {
            const testProductOne = new Product({ name: 'Name #1', client: 'Client #1' });
            await testProductOne.save();
        
            const testProductTwo = new Product({ name: 'Name #2', client: 'Client #2' });
            await testProductTwo.save();
        });
        it('should properly update one document with "updateOne" method', async () => {
            await Product.updateOne({ name: 'Name #1', client: 'Client #1'}, {$set: { name: '=Name #1=', client: '=Client #1='}});
            const updatedProduct = await Product.findOne({  name: '=Name #1=', client: '=Client #1=' });
            expect(updatedProduct).to.not.be.null;
        });
        it('should properly update one document with "save" method', async () => {
            const product = await Product.findOne({ name: 'Name #1', client: 'Client #1' });
            product.name = '=Name #1=';
            //await product.save();
            product.client = '=Client #1=';
            await product.save();
            const updatedProduct = await Product.findOne({  name: '=Name #1=', client: '=Client #1=' });
            expect(updatedProduct).to.not.be.null;
        });
        it('should properly update multiple documents with "updateMany" method', async () => {
            await Product.updateMany({}, {$set: { name: 'Updated name!', client: 'Updated client!' }});
            const products = await Product.find({name: 'Updated name!', client: 'Updated client!'});
            expect(products.length).to.be.equal(2);
        });
        afterEach(async () => {
            await Product.deleteMany();
        });
    });
    describe('Removing data', () => {
        beforeEach(async() => {
            const testProductOne = new Product({ name: 'Name #1', client: 'Client #1' });
            await testProductOne.save();
        
            const testProductTwo = new Product({ name: 'Name #2', client: 'Client #2' });
            await testProductTwo.save();
        });
        it('should properly remove one document with "deleteOne" method', async () => {
            await Product.deleteOne({ name: 'Name #1', client: 'Client #1' });
            const removedProduct = await Product.findOne({ name: 'Name #1', client: 'Client #1' });
            expect(removedProduct).to.be.null;
        });
      
        it('should properly remove multiple documents with "deleteMany" method', async () => {
            await Product.deleteMany();
            const products = await Product.find();
            expect(products.length).to.be.equal(0);
        });
        afterEach(async() => {
            await Product.deleteMany();
        });
    });
});