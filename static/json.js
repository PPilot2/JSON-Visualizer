document.getElementById('file-input').addEventListener('change', function(event) {
    event.stopImmediatePropagation(); // Prevent further propagation

    const file = event.target.files[0]; // Get the uploaded file
    const jsonOutput = document.getElementById('jsonOutput'); // Ensure you have the correct output element

    if (file) {
        if (file.type === 'application/json') { // Check if it's a JSON file
            const reader = new FileReader();

            reader.onload = function(e) {
                const jsonData = e.target.result;
                if (jsonData.length <= 15000) {
                    document.getElementById('jsonInput').value = jsonData;
                    renderJSON(); // Call your function to handle rendering
                    jsonOutput.style.display = 'block'; // Hide the output div if input is valid
                } else {
                    console.log("overflow error");
                    jsonOutput.style.display = 'block'; // Show the output div for error
                    jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">Max length of 15000 characters.</p>`;
                }
            };

            reader.readAsText(file); // Read the file as text
        } else {
            jsonOutput.style.display = 'block'; // Show the output div for error
            jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">Please upload a valid JSON file.</p>`; // Alert for invalid files
        }
    } else {
        jsonOutput.style.display = 'block'; // Show the output div for error
        jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">No file selected. Please upload a file.</p>`;
    }
});

function handleButtonClick() {
    // Your button click logic here
    alert("Overlay button clicked!");
}

const dropArea = document.getElementById('dropArea');

// Prevent default behaviors (prevent file from being opened)
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight the drop area when file is dragged over
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

// Remove highlight when dragging leaves the drop area
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

// Prevent default behavior
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent propagation to stop event from triggering multiple times
}

function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

function handleDrop(e) {
    e.stopImmediatePropagation(); // Prevent further propagation of the drop event

    const dt = e.dataTransfer;
    const file = dt.files[0];

    if (file && file.type === 'application/json') {
        const reader = new FileReader();

        reader.onload = function(e) {
            const jsonData = e.target.result;
            if (jsonData.length <= 15000) {
                document.getElementById('jsonInput').value = jsonData;
                renderJSON();
            } else {
                console.log("overflowerror drag drop")
                jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">Max length of 15000 characters.</p>`;
            }
        };

        reader.readAsText(file);
    } else {
        jsonOutput.style.display = 'block';
        jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">Please drop a valid JSON file.</p>`;
    }
}

const jsonOutput = document.getElementById('jsonOutput');
jsonOutput.style.display = 'none';

document.getElementById('openPopupButton').onclick = function() {
    document.getElementById('popupOverlay').style.display = 'flex';
};

document.getElementById('closePopupButton').onclick = function() {
    document.getElementById('popupOverlay').style.display = 'none';
};

function generateJSONFromPrompt() {
    const prompt = document.getElementById('popupInput').value;
    if (prompt) {
        // Show loading spinner
        document.getElementById('loadingSpinner').style.display = 'block';
        
        fetch('/generate_json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('jsonInput').value = data.json_data;
            renderJSON();  // Render the generated JSON
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('popupOverlay').style.display = 'none';
        })
        .catch(error => {
            console.error('Error generating JSON:', error);
            document.getElementById('loadingSpinner').style.display = 'none';
        });
    }
}

function renderJSON() {
    const jsonInput = document.getElementById('jsonInput').value;
    const jsonOutput = document.getElementById('jsonOutput');
    const expandButton = document.getElementById('expandButton');

    jsonOutput.style.display = 'block'; // Ensure output area is visible

    try {
        // Try parsing the input JSON
        const jsonData = JSON.parse(jsonInput);
        jsonOutput.innerHTML = '';  // Clear any previous output
        jsonOutput.appendChild(createNestedList(jsonData, 0));  // Render JSON with indentation (0 for the root level)
        
        // Enable the expand button after rendering
        expandButton.disabled = false;

    } catch (e) {
        // If parsing fails, display the error message
        jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">Invalid JSON: ${e.message}</p>`;
        expandButton.disabled = true;  // Disable expand button if there's an error
    }
}
// Expand all functionality
let isExpanded = false;
document.getElementById('expandButton').addEventListener('click', function() {
    const nestedLists = document.querySelectorAll('#jsonOutput ul ul');
    const toggleText = isExpanded ? '[+]' : '[-]';
    const displayStyle = isExpanded ? 'none' : 'block';

    nestedLists.forEach(nestedList => {
        nestedList.style.display = displayStyle;
        const parentLi = nestedList.parentElement;
        const toggleButton = parentLi.querySelector('.toggle-btn');
        
        if (toggleButton) {
            toggleButton.textContent = toggleText;
        }
    });

    this.textContent = isExpanded ? 'Expand All' : 'Collapse All';
    isExpanded = !isExpanded;
});

function createNestedList(data, level) {
    const ul = document.createElement('ul');
    
    // Apply indentation based on the level
    ul.style.paddingLeft = `${level * 10}px`;

    for (const key in data) {
        const li = document.createElement('li');

        if (typeof data[key] === 'object' && data[key] !== null) {
            // Nested object: create a toggle button and recursively render its content
            const toggleButton = document.createElement('span');
            toggleButton.textContent = '[+]';
            toggleButton.classList.add('toggle-btn');

            const nestedList = createNestedList(data[key], level + 1); // Increase indentation level for nested objects
            nestedList.style.display = 'none';  // Start hidden

            toggleButton.addEventListener('click', function() {
                if (nestedList.style.display === 'none') {
                    nestedList.style.display = 'block';
                    toggleButton.textContent = '[-]';
                } else {
                    nestedList.style.display = 'none';
                    toggleButton.textContent = '[+]';
                }
            });

            li.appendChild(toggleButton);
            li.appendChild(document.createTextNode(key + ': '));
            li.appendChild(nestedList);
        } else {
            // Simple key-value pair
            li.textContent = `${key}: ${data[key]}`;
        }

        ul.appendChild(li);
    }

    return ul;
}