import assert from 'assert';
import {ParseTable, parseCode, createTable} from '../src/js/code-analyzer';


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

describe('The functions parser', () => {
    it('is parsing functions correctly', () => {
        let jsonString = parseCode('function funcName(X){}');
        let output = ParseTable(jsonString,[]);
        assert.deepEqual(
            output,
            [['1 to 1','function declaration','funcName','',''],['1 to 1','variable declaration','X','','']]
        );
    });
});

describe('The else if parser', () => {
    it('is parsing else if correctly', () => {
        let jsonString = parseCode( 'function funcName(i){\n' +
                                    '     if(i < 5)\n' +
                                    '          return 5;\n' +
                                    '     else if(i > 0)\n' +
                                    '          return 0;\n' +
                                    '     else if(i > -4)\n' +
                                    '          return -4;\n' +
                                    '     else\n' +
                                    '          return -1;\n' +
                                    '}');
        let output = ParseTable(jsonString,[]);
        assert.deepEqual(
            output,
            [['1 to 10','function declaration','funcName','',''],['1 to 10','variable declaration','i','',''],['2 to 9','if statement','','i < 5',''],['3 to 3','return statement','','','5'],['4 to 9','else if statement','','i > 0',''],['5 to 5','return statement','','','0'],['6 to 9','else if statement','','i > -4',''],['7 to 7','return statement','','','-4'],['...','else statement','','',''],['9 to 9','return statement','','','-1']]
        );
    });
});

describe('The for loops parser', () => {
    it('is parsing for loops correctly', () => {
        let jsonString = parseCode( 'function funcName(i){\n' +
                                    '     for(i = 0;i <= i;i++){\n' +
                                    '           return -1;\n' +
                                    '     }\n' +
                                    '}');
        let output = ParseTable(jsonString,[]);
        assert.deepEqual(
            output,
            [['1 to 5','function declaration','funcName','',''],['1 to 5','variable declaration','i','',''],['2 to 4','for statement','','i = 0;i <= i;i++',''],['3 to 3','return statement','','','-1']]
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
/*
describe('The table creator', () => {
    it('is creating a table correctly', () => {
        let jsonString = createTable(['test1','test2'],['test3','test4']);
        assert.deepEqual(
            jsonString,
            ' <table>' +'<tr>' + '<td>' + '</td>' + '</tr>' + '</table>'
        );
    });
});
*/