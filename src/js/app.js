import $ from 'jquery';
import {parseCode, ParseTable, makeTableHTML} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let parsedCodeTable = ParseTable(parsedCode, []);
        $('#htmlCode').append(makeTableHTML(parsedCodeTable));
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
    $('#codeClear').click(() => {
        var list = document.getElementById('htmlCode');
        list.removeChild(list.childNodes[0]);
    });
});

export {ParseTable};