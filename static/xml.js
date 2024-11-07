const xmlOutput = document.getElementById('xmlOutput');
const expandButton = document.getElementById('expandButton');
const errorOutput = document.getElementById('errorOutput');
xmlOutput.style.display = 'none';

document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Get the uploaded file

    if (file) {
        if (file.type === 'application/xml' || file.type === 'text/xml') { // Check if it's an XML file
            const reader = new FileReader();

            reader.onload = function(e) {
                const xmlData = e.target.result;
                if (xmlData.length <= 15000) {
                    document.getElementById('xmlInput').value = xmlData;
                    renderXML(); // Call your function to handle rendering the XML
                    xmlOutput.style.display = 'block'; // Show the output div if input is valid
                } else {
                    console.log("overflow error");
                    xmlOutput.style.display = 'block'; // Show the output div for error
                    xmlOutput.innerHTML = `<p style="color: red; font-weight: bold;">Max length of 15000 characters.</p>`;
                }
            };

            reader.readAsText(file); // Read the file as text
        } else {
            xmlOutput.style.display = 'block'; // Show the output div for error
            xmlOutput.innerHTML = `<p style="color: red; font-weight: bold;">Please upload a valid XML file.</p>`; // Alert for invalid files
        }
    } else {
        xmlOutput.style.display = 'block'; // Show the output div for error
        xmlOutput.innerHTML = `<p style="color: red; font-weight: bold;">No file selected. Please upload a file.</p>`;
    }
});

// Prevent default behavior and stop propagation
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];

    if (file && file.type === 'text/xml') {
        const reader = new FileReader();

        reader.onload = function(e) {
            const xmlData = e.target.result;
            document.getElementById('xmlInput').value = xmlData;
            renderXML();
        };

        reader.readAsText(file);
    } else {
        errorOutput.innerHTML = `<p>Please drop a valid XML file.</p>`;
    }
}

// Render XML function
function renderXML() {
    event.stopPropagation();  // Stop event propagation
    const xmlInput = document.getElementById('xmlInput').value;
    errorOutput.innerHTML = ''; // Clear error messages

    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlInput, "application/xml");

        // Check for invalid XML (parsererror)
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            throw new Error("Invalid XML format.");
        }

        xmlOutput.style.display = 'block';
        xmlOutput.innerHTML = ''; // Clear previous output
        const rootNode = xmlDoc.documentElement;

        xmlOutput.appendChild(createTree(rootNode));
        expandButton.disabled = false;
    } catch (e) {
        errorOutput.innerHTML = `<p>Error: ${e.message}</p>`;
        xmlOutput.style.display = 'none';
        expandButton.disabled = true;
    }
}

function createTree(node) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = node.nodeName;
    span.classList.add('toggle-btn');

    // Create expand/collapse indicators
    const indicator = document.createElement('span');
    indicator.classList.add('indicator');
    indicator.textContent = '[+]'; // Default indicator for collapsed state
    span.prepend(indicator);

    const childrenContainer = document.createElement('ul');
    childrenContainer.style.display = 'none'; // Initially collapsed

    span.addEventListener('click', function() {
        const isCollapsed = childrenContainer.style.display === 'none';
        childrenContainer.style.display = isCollapsed ? 'block' : 'none';
        indicator.textContent = isCollapsed ? '[-]' : '[+]'; // Update indicator
    });

    // Process child nodes
    node.childNodes.forEach(child => {
        if (child.nodeType === 1) { // Element node
            childrenContainer.appendChild(createTree(child));
        } else if (child.nodeType === 3 && child.nodeValue.trim()) { // Text node
            const textLi = document.createElement('li');
            textLi.textContent = child.nodeValue.trim();
            childrenContainer.appendChild(textLi);
        }
    });

    // Process attributes
    if (node.attributes.length > 0) {
        const attrUl = document.createElement('ul');
        for (let i = 0; i < node.attributes.length; i++) {
            const attrLi = document.createElement('li');
            attrLi.textContent = `${node.attributes[i].name}="${node.attributes[i].value}"`;
            attrUl.appendChild(attrLi);
        }
        childrenContainer.appendChild(attrUl);
    }

    li.appendChild(span);
    li.appendChild(childrenContainer);
    return li;
}

// Expand/Collapse All functionality
expandButton.addEventListener('click', function() {
    const isExpanded = expandButton.textContent === 'Expand All';
    updateAllNodes(isExpanded);
    expandButton.textContent = isExpanded ? 'Collapse All' : 'Expand All';
});

function updateAllNodes(expand) {
    const nestedLists = document.querySelectorAll('#xmlOutput ul');
    nestedLists.forEach(nestedList => {
        nestedList.style.display = expand ? 'block' : 'none';
    });

    // Update indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach(indicator => {
        indicator.textContent = expand ? '[-]' : '[+]';
    });
}

// Drag and Drop functionality
const dropArea = document.getElementById('dropArea');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener('drop', handleDrop, false);
