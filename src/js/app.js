import $ from 'jquery';
import {parseCode, createTable, ParseTable} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let parsedCodeTable = ParseTable(parsedCode, []);
        $('#htmlCode').val(createTable(parsedCodeTable) );
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
    $('#codeClear').click(() => {
        var list = document.getElementById('htmlCode');
        list.removeChild(list.childNodes[0]);
    });
});

export {ParseTable};