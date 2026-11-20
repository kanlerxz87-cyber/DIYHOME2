// Dependency-free arithmetic/regression checks for the browser event handlers.
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const listeners = {}, fields = {}, result = {}, group = {};
const form = {querySelector: () => group, addEventListener: (k, f) => listeners[k] = f,
  elements: {namedItem: key => fields[key]}};
runInNewContext(readFileSync(__dirname + '/worksheet.js', 'utf8'), {document: {
  querySelector: selector => ({'#calc': form, '#result': result, '#print': {addEventListener() {}}}[selector])}});
assert.equal((group.innerHTML.match(/ required /g) || []).length, 9);
function check(matrix, pattern) {
  matrix.forEach((row,g) => row.forEach((v,a) => fields[`g${g}a${a}`] = {valueAsNumber:v}));
  listeners.submit({preventDefault(){}}); assert.match(result.textContent, pattern);
}
check([[60,50,55],[40,40,40],[20,10,15]], /^Within.*Width: 0 cm/);
check([[60,50,55],[40,40,40],[20,12,15]], /Not enough.*Depth: 2 cm short/);
check([[0.3,50,55],[0.1,40,40],[0.2,10,15]], /^Within.*Width: 0 cm/);
listeners.reset(); assert.equal(result.textContent,'');
