// content.js

(function () {
  // Configuration
  const CONFIG = {
    theme: 'dark', // 'dark' or 'light'
  };

  let rawJSONText = '';
  let jsonObject = null;
  let lineCounter = 1;

  // Check if the page is JSON
  function isJSONPage() {
    if (document.contentType === 'application/json') return true;

    const text = document.body.innerText.trim();
    if (!text) return false;

    try {
      JSON.parse(text);
      return (text.startsWith('{') || text.startsWith('['));
    } catch (e) {
      return false;
    }
  }

  function getJSONContent() {
    const text = document.body.innerText.trim();
    rawJSONText = text;
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON', e);
      return null;
    }
  }

  function createNode(key, value, type, depth) {
    const node = document.createElement('div');
    node.className = 'json-node';
    node.style.setProperty('--depth', depth);

    // Line Number
    const lineNum = document.createElement('span');
    lineNum.className = 'line-number';
    lineNum.textContent = lineCounter++;
    node.appendChild(lineNum);

    // Collapser for objects/arrays
    if (type === 'object' || type === 'array') {
      const collapser = document.createElement('span');
      collapser.className = 'collapser';
      collapser.textContent = '▼';
      collapser.onclick = (e) => {
        e.stopPropagation();
        node.classList.toggle('collapsed');
      };
      node.appendChild(collapser);
    }

    // Key
    if (key !== null) {
      const keySpan = document.createElement('span');
      keySpan.className = 'json-key';
      keySpan.textContent = `"${key}": `;
      node.appendChild(keySpan);
    }

    // Value
    const valueSpan = document.createElement('span');
    valueSpan.className = `json-value ${type}`;

    if (type === 'object') {
      valueSpan.innerHTML = '<span class="json-bracket">{</span>';
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'json-children';

      const keys = Object.keys(value);
      keys.forEach((k, index) => {
        const childNode = renderTree(k, value[k], index === keys.length - 1, depth + 1);
        childrenContainer.appendChild(childNode);
      });

      node.appendChild(valueSpan);
      node.appendChild(childrenContainer);

      // Closing bracket on new line? For simplicity in this tree view, 
      // we often put closing bracket on a new line if children exist.
      // To support line numbers correctly for the closing bracket, we need a new node or just append it.
      // Let's create a separate node for the closing bracket to give it a line number.
      const closeNode = document.createElement('div');
      closeNode.className = 'json-node closing-node';
      closeNode.style.setProperty('--depth', depth); // Same depth as opening
      const closeLineNum = document.createElement('span');
      closeLineNum.className = 'line-number';
      closeLineNum.textContent = lineCounter++;
      closeNode.appendChild(closeLineNum);

      const closeBracket = document.createElement('span');
      closeBracket.innerHTML = '<span class="json-bracket">}</span>' + (node.dataset.isLast ? '' : ',');
      closeNode.appendChild(closeBracket);

      // We append the closeNode to the childrenContainer so it hides when collapsed
      childrenContainer.appendChild(closeNode);

    } else if (type === 'array') {
      valueSpan.innerHTML = '<span class="json-bracket">[</span>';
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'json-children';

      value.forEach((item, index) => {
        const childNode = renderTree(null, item, index === value.length - 1, depth + 1);
        childrenContainer.appendChild(childNode);
      });

      node.appendChild(valueSpan);
      node.appendChild(childrenContainer);

      const closeNode = document.createElement('div');
      closeNode.className = 'json-node closing-node';
      closeNode.style.setProperty('--depth', depth); // Same depth as opening
      const closeLineNum = document.createElement('span');
      closeLineNum.className = 'line-number';
      closeLineNum.textContent = lineCounter++;
      closeNode.appendChild(closeLineNum);

      const closeBracket = document.createElement('span');
      closeBracket.innerHTML = '<span class="json-bracket">]</span>' + (node.dataset.isLast ? '' : ',');
      closeNode.appendChild(closeBracket);

      childrenContainer.appendChild(closeNode);

    } else {
      // Primitive values
      if (type === 'string') {
        valueSpan.textContent = `"${value}"`;
      } else {
        valueSpan.textContent = String(value);
      }
      if (!node.dataset.isLast) {
        valueSpan.textContent += ',';
      }
      node.appendChild(valueSpan);
    }

    return node;
  }

  function renderTree(key, value, isLast, depth = 0) {
    let type = typeof value;
    if (value === null) type = 'null';
    else if (Array.isArray(value)) type = 'array';

    const node = createNode(key, value, type, depth);
    if (isLast) node.dataset.isLast = 'true';
    return node;
  }

  function createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.id = 'json-formatter-toolbar';

    // Raw/Formatted Toggle
    const rawToggle = document.createElement('div');
    rawToggle.className = 'toolbar-item';
    const rawCheckbox = document.createElement('input');
    rawCheckbox.type = 'checkbox';
    rawCheckbox.id = 'raw-toggle';
    rawCheckbox.onchange = (e) => {
      if (e.target.checked) {
        document.body.classList.add('show-raw');
      } else {
        document.body.classList.remove('show-raw');
      }
    };
    const rawLabel = document.createElement('label');
    rawLabel.htmlFor = 'raw-toggle';
    rawLabel.textContent = 'Show Raw';
    rawToggle.appendChild(rawCheckbox);
    rawToggle.appendChild(rawLabel);
    toolbar.appendChild(rawToggle);

    // Line Numbers Toggle
    const lineToggle = document.createElement('div');
    lineToggle.className = 'toolbar-item';
    const lineCheckbox = document.createElement('input');
    lineCheckbox.type = 'checkbox';
    lineCheckbox.id = 'line-toggle';
    lineCheckbox.checked = true; // Default on
    lineCheckbox.onchange = (e) => {
      if (e.target.checked) {
        document.body.classList.remove('hide-line-numbers');
      } else {
        document.body.classList.add('hide-line-numbers');
      }
    };
    const lineLabel = document.createElement('label');
    lineLabel.htmlFor = 'line-toggle';
    lineLabel.textContent = 'Line Numbers';
    lineToggle.appendChild(lineCheckbox);
    lineToggle.appendChild(lineLabel);
    toolbar.appendChild(lineToggle);

    // Copy Button
    const copyItem = document.createElement('div');
    copyItem.className = 'toolbar-item';
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy JSON';
    copyBtn.style.cursor = 'pointer';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(JSON.stringify(jsonObject, null, 2));
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy JSON', 2000);
    };
    copyItem.appendChild(copyBtn);
    toolbar.appendChild(copyItem);

    return toolbar;
  }

  function init() {
    if (!isJSONPage()) return;

    jsonObject = getJSONContent();
    if (!jsonObject) return;

    console.log('JSON Formatter: JSON detected');

    // Clear existing content
    document.body.innerHTML = '';
    document.body.className = 'json-formatter-active';

    // Toolbar
    document.body.appendChild(createToolbar());

    // Root for Formatted View
    const root = document.createElement('div');
    root.id = 'json-formatter-root';

    lineCounter = 1; // Reset counter
    const tree = renderTree(null, jsonObject, true);
    tree.classList.add('root');
    root.appendChild(tree);
    document.body.appendChild(root);

    // Raw View Container
    const rawView = document.createElement('div');
    rawView.id = 'json-raw-view';
    rawView.textContent = rawJSONText;
    document.body.appendChild(rawView);
  }

  // Run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
