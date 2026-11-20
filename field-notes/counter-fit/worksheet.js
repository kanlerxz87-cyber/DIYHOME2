const axes = ['Width', 'Depth', 'Height'];
const groups = ['Available space', 'Appliance size', 'Total clearance'];
const form = document.querySelector('#calc');
const result = document.querySelector('#result');
form.querySelector('.groups').innerHTML = groups.map((name, g) => `<fieldset><legend>${name}</legend>${axes.map((axis, a) => `<label>${axis} (cm)<input type="number" required min="${g === 2 ? '0' : '0.01'}" step="0.01" name="g${g}a${a}"></label>`).join('')}</fieldset>`).join('');
form.addEventListener('submit', event => {
  event.preventDefault();
  const remaining = axes.map((_, a) => {
    const n = groups.map((_, g) => Math.round(form.elements.namedItem(`g${g}a${a}`).valueAsNumber * 100));
    return (n[0] - n[1] - n[2]) / 100;
  });
  result.textContent = (remaining.every(n => n >= 0) ? 'Within the dimensions entered. ' : 'Not enough space on the marked axes. ') + remaining.map((v, i) => `${axes[i]}: ${Math.abs(v)} cm ${v < 0 ? 'short' : 'to spare'}`).join('; ') + '. Confirm door movement and operating requirements in the manual.';
});
for (const event of ['reset', 'input']) form.addEventListener(event, () => { result.textContent = ''; });
document.querySelector('#print').addEventListener('click', () => window.print());
