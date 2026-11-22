// Offline startup regression: a room spectator must render without an MQTT connection.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { webcrypto } = require('node:crypto');
const elements = new Map();
const element = id => {
  if (!elements.has(id)) elements.set(id, {
    value: '', textContent: '', innerHTML: '', style: {}, dataset: {},
    classList: { add() {}, remove() {}, toggle() {} },
    querySelectorAll: () => [], querySelector: selector => element(id + selector),
    addEventListener() {}, appendChild() {}, scrollTo() {},
    setAttribute() {}, removeAttribute() {},
  });
  return elements.get(id);
};
const storage = () => {
  const values = new Map();
  return { getItem: k => values.get(k) || null, setItem: (k, v) => values.set(k, v) };
};
const location = { hash: '#room=smoke1', pathname: '/valorant-side/',
  protocol: 'https:', hostname: 'jjoggomibot.github.io', origin: 'https://jjoggomibot.github.io' };
const document = { title: '내전 테스트', activeElement: null,
  getElementById: element, querySelectorAll: () => [],
  querySelector: () => ({ value: 'ban' }), addEventListener() {} };
const window = { sessionStorage: storage(), localStorage: storage(), addEventListener() {} };
const context = { window, document, location, crypto: webcrypto,
  TextEncoder, TextDecoder, URLSearchParams, console,
  history: { replaceState() {} }, matchMedia: () => ({ matches: true }),
  setTimeout() {}, setInterval() {}, clearTimeout() {}, clearInterval() {},
  requestAnimationFrame() {}, navigator: {}, btoa, atob };
vm.runInNewContext(fs.readFileSync(process.argv[2] || require('node:path').join(__dirname, '../app.js'), 'utf8'), context);
setTimeout(() => {
  assert.equal(element('myRole').textContent, '👀 관전 중');
  assert.equal(element('rmCode').textContent, 'SMOKE1');
  console.log('Room spectator startup passed without network access');
}, 100);
