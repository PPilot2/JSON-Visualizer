const jsonOutput = document.getElementById('jsonOutput');
jsonOutput.style.display = 'none';

document.getElementById('renderButton').addEventListener('click', function() {
    const jsonInput = document.getElementById('jsonInput').value;
    jsonOutput.style.display = 'block'; // Show the output div

    try {
        const jsonData = JSON.parse(jsonInput);
        jsonOutput.innerHTML = ''; // Clear previous output
        jsonOutput.appendChild(createNestedList(jsonData));
    } catch (e) {
        jsonOutput.innerHTML = `<p style="color: red;">Invalid JSON: ${e.message}</p>`;
    }
});

// Expand All functionality
document.getElementById('expandButton').addEventListener('click', function() {
    const items = document.querySelectorAll('.toggle-btn');
    items.forEach(item => {
        const nestedList = item.nextElementSibling; // Get the associated nested list
        if (nestedList) {
            expandList(nestedList, item);
            // console.log(nestedList);
            // console.log(item); // Expand the nested list
        }
    });
});

// Function to expand a list and its children
function expandList(nestedList, button) {
    nestedList.style.display = 'block'; // Show the nested list
    button.textContent = '[-]'; // Change to collapse button
    console.log(nestedList);
    const childItems = nestedList.querySelectorAll('.toggle-btn');
    console.log(childItems); // Get all child toggle buttons
    childItems.forEach(child => {
        const childNestedList = child.nextElementSibling; // Get the associated child nested list
        if (childNestedList) {
            expandList(childNestedList, child); // Recursively expand the child list
        }
    });
}

function createNestedList(data) {
    const ul = document.createElement('ul');
    ul.classList.add('json-list');

    for (const key in data) {
        const li = document.createElement('li');
        li.classList.add('json-item');

        if (typeof data[key] === 'object' && data[key] !== null) {
            const toggleButton = document.createElement('span');
            toggleButton.textContent = '[+]';
            toggleButton.classList.add('toggle-btn');
            
            const keySpan = document.createElement('span');
            keySpan.textContent = key + ': ';
            
            const nestedList = createNestedList(data[key]);
            nestedList.style.display = 'none'; // Hide the nested list initially
            
            toggleButton.addEventListener('click', function() {
                if (nestedList.style.display === 'none') {
                    nestedList.style.display = 'block'; // Show the nested list
                    toggleButton.textContent = '[-]'; // Change to collapse button
                } else {
                    nestedList.style.display = 'none'; // Hide the nested list
                    toggleButton.textContent = '[+]'; // Change to expand button
                }
            });
            
            li.appendChild(toggleButton);
            li.appendChild(keySpan);
            li.appendChild(nestedList);
        } else {
            li.textContent = `${key}: ${data[key]}`;
        }

        ul.appendChild(li);
    }
    return ul;
}
