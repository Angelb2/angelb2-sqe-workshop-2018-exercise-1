import assert from 'assert';
import {ParseTable,parseCode} from '../src/js/code-analyzer';


describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}}},"init":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}'
        );
    });
});
describe('The expressions parser', () => {
    it('is parsing let expressions correctly', () => {
        let jsonString = parseCode('let low;');
        let output = ParseTable(jsonString,[]);
        assert.deepEqual(
            output,
            [['1 to 1','variable declaration','low','','']]
        );
    });
});

describe('The expressions parser', () => {
    it('is parsing assignment expressions correctly', () => {
        let jsonString = parseCode('low = 0;');
        let output = ParseTable(jsonString,[]);
        assert.deepEqual(
            output,
            [['1 to 1','assignment expression','low','','0']]
        );
    });
});

describe('The statements parser', () => {
    it('is parsing while statements correctly', () => {
        let jsonString = parseCode('while (low <= high) {\n' +
                                    '    low=low+1;\n' +
                                    '}');
        let output = ParseTable(jsonString,[]);
        assert.deepEqual(
            output,
            [['1 to 3','while statement','','low <= high',''],['2 to 2','assignment expression','low','','low + 1']]
        );
    });
});

describe('The statements parser', () => {
    it('is parsing return and function statements correctly', () => {
        let jsonString = parseCode('function funcName(){\n' +
                                    '    return -1;\n' +
                                    '}');
        let output = ParseTable(jsonString,[]);
        assert.deepEqual(
            output,
            [['1 to 3','function declaration','funcName','',''],['2 to 2','return statement','','','-1']]
        );
    });
});
describe('The statements parser', () => {
    it('is parsing if statements correctly', () => {
        let jsonString = parseCode('function funcName(){\n' +
                                    '    if (X < Y)\n' +
                                    '        high = mid;\n' +
                                    '    else\n' +
                                    '        return mid;\n' +
                                    '}');
        let output = ParseTable(jsonString,[]);
        assert.deepEqual(
            output,
            [   ['1 to 6','function declaration','funcName','',''], ['2 to 5','if statement','','X < Y',''], ['3 to 3','assignment expression','high','','mid'], ['...',   'else statement','','',''], ['5 to 5','return statement','','','mid']   ]
        );
    });
});
