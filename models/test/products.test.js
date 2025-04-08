const Product = require('./../products.model');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Product', () => {
    it('should throw an error if no args', () => {
        const prod = new Product({});
        prod.validateSync(err => {
            expect(err.errors.name).to.exist;
            expect(err.errors.client).to.exist;
        });
    });
    it('should throw an error if args are not a string', () => {
        const cases = [{}, []];
        for(let data of cases){
            const prod = new Product({ name: data, client: data });
            prod.validateSync(err => {
                expect(err.errors.name).to.exist;
                expect(err.errors.client).to.exist;
            });
        }
    });
    it('should return new product if good args', () => {
        const cases = ['TBC Inc.', 'Lorem Ltd.', 'New Wave Music Corp.', 'A101'];
        for(let data of cases){
            const prod = new Product({ name: data, client: data });
            prod.validateSync(err => {
                expect(err.errors.name).to.not.exist;
                expect(err.errors.client).to.not.exist;
            });
        }
    });
});