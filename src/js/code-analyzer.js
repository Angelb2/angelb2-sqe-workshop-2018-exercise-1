import * as esprima from 'esprima';
import escodegen from 'escodegen';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc: true});
};

function createTable(tableData) {
    var table = document.createElement('table');
    table.border = 1; table.style = 'width:100%';
    var tableBody = document.createElement('tbody');
    var firstRow = document.createElement('tr'); firstRow.bgColor = '#c7d0dd';
    var cell1 = document.createElement('td'); cell1.appendChild(document.createTextNode('lines'));
    var cell2 = document.createElement('td'); cell2.appendChild(document.createTextNode('type'));
    var cell3 = document.createElement('td'); cell3.appendChild(document.createTextNode('name'));
    var cell4 = document.createElement('td'); cell4.appendChild(document.createTextNode('condition'));
    var cell5 = document.createElement('td'); cell5.appendChild(document.createTextNode('value'));
    firstRow.appendChild(cell1); firstRow.appendChild(cell2); firstRow.appendChild(cell3); firstRow.appendChild(cell4); firstRow.appendChild(cell5);
    tableBody.appendChild(firstRow);
    tableData.forEach(function(rowData) {
        var row = document.createElement('tr');
        rowData.forEach(function(cellData) { var cell = document.createElement('td'); cell.appendChild(document.createTextNode(cellData)); row.appendChild(cell); });
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody); document.getElementById('htmlCode').appendChild(table);
}

function ParseFunctionDecl(parsedCodeBody,result){
    let lineStart = parsedCodeBody.loc.start.line;
    let lineFinish = parsedCodeBody.loc.end.line;
    let type = 'function declaration';
    let name = parsedCodeBody.id.name;
    let condition = '';
    let value = '';
    result.push([(lineStart + ' to ' + lineFinish) ,type ,name ,condition,value]);
    var i;
    for(i = 0; i<parsedCodeBody.params.length; i++) {
        result.push([(lineStart + ' to ' + lineFinish), 'variable declaration', parsedCodeBody.params[i].name, '', '']);
    }
    ParseTable(parsedCodeBody.body,result);
}

function ParseVariableDecl(parsedCodeBody,result){
    let lineStart = parsedCodeBody.loc.start.line;
    let lineFinish = parsedCodeBody.loc.end.line;
    let type = 'variable declaration';
    var i;
    let condition = '';
    let value = '';
    for(i = 0; i<parsedCodeBody.declarations.length; i++){
        let name = parsedCodeBody.declarations[i].id.name;
        result.push([(lineStart + ' to ' + lineFinish) ,type ,name ,condition,value]);
    }
}

function ParseExpressionStatement(parsedCodeBody,result){
    if(parsedCodeBody.expression.operator === '='){
        let lineStart = parsedCodeBody.loc.start.line;
        let lineFinish = parsedCodeBody.loc.end.line;
        let type = 'assignment expression';
        let name = parsedCodeBody.expression.left.name;
        let condition = '';
        let value = escodegen.generate(parsedCodeBody.expression.right);
        result.push([(lineStart + ' to ' + lineFinish) ,type ,name ,condition,value]);
    }
}

function ParseReturnStatement(parsedCodeBody,result){
    let lineStart = parsedCodeBody.loc.start.line;
    let lineFinish = parsedCodeBody.loc.end.line;
    let type = 'return statement';
    let name = '';
    let condition = '';
    let value = escodegen.generate(parsedCodeBody.argument);
    result.push([(lineStart + ' to ' + lineFinish) ,type ,name ,condition,value]);
}

function ParseWhileStatement(parsedCodeBody,result){
    let lineStart = parsedCodeBody.loc.start.line;
    let lineFinish = parsedCodeBody.loc.end.line;
    let type = 'while statement';
    let name = '';
    let condition = escodegen.generate(parsedCodeBody.test);
    let value = '';
    result.push([(lineStart + ' to ' + lineFinish) ,type ,name ,condition,value]);
    ParseTable(parsedCodeBody.body,result);
}

function ParseElseIfStatement(parsedCodeBody, result){
    let lineStart = parsedCodeBody.loc.start.line;
    let lineFinish = parsedCodeBody.loc.end.line;
    let type = 'else if statement';
    let name = '';
    let condition = escodegen.generate(parsedCodeBody.test);
    let value = '';
    result.push([(lineStart + ' to ' + lineFinish) ,type ,name ,condition,value]);
    ParseExpression(parsedCodeBody.consequent, result);
    if(parsedCodeBody.alternate.type === 'IfStatement'){
        ParseElseIfStatement(parsedCodeBody.alternate, result);
    }
    else{
        result.push(['...' ,'else statement' ,''  ,'' ,'']);
        ParseExpression(parsedCodeBody.alternate, result);
    }
}

function ParseIfStatement(parsedCodeBody, result){
    let lineStart = parsedCodeBody.loc.start.line;
    let lineFinish = parsedCodeBody.loc.end.line;
    let type = 'if statement';
    let name = '';
    let condition = escodegen.generate(parsedCodeBody.test);
    let value = '';
    result.push([(lineStart + ' to ' + lineFinish) ,type ,name ,condition,value]);
    ParseExpression(parsedCodeBody.consequent, result);
    if(parsedCodeBody.alternate.type === 'IfStatement'){
        ParseElseIfStatement(parsedCodeBody.alternate, result);
    }
    else{
        result.push(['...' ,'else statement' ,''  ,'' ,'']);
        ParseExpression(parsedCodeBody.alternate, result);
    }
}

function ParseForStatement(parsedCodeBody,result){
    let lineStart = parsedCodeBody.loc.start.line;
    let lineFinish = parsedCodeBody.loc.end.line;
    let type = 'for statement';
    let name = '';
    let condition = escodegen.generate(parsedCodeBody.init) +';'+ escodegen.generate(parsedCodeBody.test) +';'+ escodegen.generate(parsedCodeBody.update);
    let value = '';
    result.push([(lineStart + ' to ' + lineFinish) ,type ,name ,condition,value]);
    ParseTable(parsedCodeBody.body,result);
}

function ParseExpression(parsedCodeBody, result) {
    var parserMap = new Map();
    parserMap.set('FunctionDeclaration', ParseFunctionDecl);
    parserMap.set('VariableDeclaration', ParseVariableDecl);
    parserMap.set('ExpressionStatement', ParseExpressionStatement);
    parserMap.set('ReturnStatement', ParseReturnStatement);
    parserMap.set('WhileStatement', ParseWhileStatement);
    parserMap.set('IfStatement', ParseIfStatement);
    parserMap.set('ForStatement', ParseForStatement);
    (parserMap.get(parsedCodeBody.type))(parsedCodeBody,result);
}

function ParseTable(parsedCode, result) {
    var i;
    for(i = 0; i<parsedCode.body.length; i++){
        //value = escodegen.generate(parsedCode.body[i].right);
        ParseExpression(parsedCode.body[i],result);
    }
    return result;
}


export {parseCode, ParseTable, createTable};
