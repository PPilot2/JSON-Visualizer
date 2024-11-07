// const jsonOutput = document.getElementById('jsonOutput');
// jsonOutput.style.display = 'none';

// document.getElementById('openPopupButton').onclick = function() {
//     document.getElementById('popupOverlay').style.display = 'flex';
// };

// document.getElementById('closePopupButton').onclick = function() {
//     document.getElementById('popupOverlay').style.display = 'none';
// };

// function renderButton() {
//     event.stopPropagation(); 
//     const jsonInput = document.getElementById('jsonInput').value;
//     const expandButton = document.getElementById('expandButton');
//     jsonOutput.style.display = 'block'; // Show the output div

//     try {
//         const jsonData = JSON.parse(jsonInput);
//         jsonOutput.innerHTML = ''; // Clear previous output
//         jsonOutput.appendChild(createNestedList(jsonData));

//         expandButton.disabled = false;
//     } catch (e) {
//         if (e.message === 'Unexpected end of JSON input') {
//             if (jsonOutput.innerHTML.length > 0) {
//             } else {
//                 jsonOutput.style.display = 'none';
//             }
//         }
//         jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">Invalid JSON: ${e.message}</p>`;
//         expandButton.disabled = true;
//     }
// }
// // Expand All functionality
// let isExpanded = false;
// document.getElementById('expandButton').addEventListener('click', function() {
//     const nestedLists = document.querySelectorAll('#jsonOutput ul ul'); // Grab all <ul> elements inside jsonOutput
//     const toggleText = isExpanded ? '[+]' : '[-]'; // Toggle between expand/collapse button text
//     const displayStyle = isExpanded ? 'none' : 'block'; // Toggle display style

//     nestedLists.forEach(nestedList => {
//         nestedList.style.display = displayStyle; // Expand or collapse each <ul>
        
//         const parentLi = nestedList.parentElement; // Find the parent <li> of the current <ul>
//         const toggleButton = parentLi.querySelector('.toggle-btn'); // Find the toggle button inside the parent <li>
        
//         if (toggleButton) {
//             toggleButton.textContent = toggleText; // Update the toggle button text based on the state
//         }
//     });

//     // Update the button label and toggle state
//     this.textContent = isExpanded ? 'Expand All' : 'Collapse All';
//     isExpanded = !isExpanded;
// });
// document.getElementById('file-input').addEventListener('change', function(event) {
//     const file = event.target.files[0]; // Get the uploaded file
//     const jsonOutput = document.getElementById('jsonOutput'); // Ensure you have the correct output element

//     if (file) {
//         if (file.type === 'application/json') { // Check if it's a JSON file
//             const reader = new FileReader();

//             reader.onload = function(e) {
//                 const jsonData = e.target.result;
//                 if (jsonData.length <= 15000) {
//                     document.getElementById('jsonInput').value = jsonData;
//                     renderButton(); // Call your function to handle rendering
//                     jsonOutput.style.display = 'none'; // Hide the output div if input is valid
//                 } else {
//                     console.log("overflow error");
//                     jsonOutput.style.display = 'block'; // Show the output div for error
//                     jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">Max length of 15000 characters.</p>`;
//                 }
//             };

//             reader.readAsText(file); // Read the file as text
//         } else {
//             jsonOutput.style.display = 'block'; // Show the output div for error
//             jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">Please upload a valid JSON file.</p>`; // Alert for invalid files
//         }
//     } else {
//         jsonOutput.style.display = 'block'; // Show the output div for error
//         jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">No file selected. Please upload a file.</p>`;
//     }
// });


// function createNestedList(data) {
//     const ul = document.createElement('ul');
//     ul.classList.add('json-list');
//     for (const key in data) {
//         const li = document.createElement('li');
//         li.classList.add('json-item');

//         if (typeof data[key] === 'object' && data[key] !== null) {
//             const toggleButton = document.createElement('span');
//             toggleButton.textContent = '[+]';
//             toggleButton.classList.add('toggle-btn');
            
//             const keySpan = document.createElement('span');
//             keySpan.textContent = key + ': ';
            
//             const nestedList = createNestedList(data[key]);
//             nestedList.style.display = 'none'; // Hide the nested list initially
            
//             toggleButton.addEventListener('click', function() {
//                 if (nestedList.style.display === 'none') {
//                     nestedList.style.display = 'block'; // Show the nested list
//                     toggleButton.textContent = '[-]'; // Change to collapse button
//                 } else {
//                     nestedList.style.display = 'none'; // Hide the nested list
//                     toggleButton.textContent = '[+]'; // Change to expand button
//                 }
//             });
            
//             li.appendChild(toggleButton);
//             li.appendChild(keySpan);
//             li.appendChild(nestedList);
//         } else {
//             li.textContent = `${key}: ${data[key]}`;
//         }

//         ul.appendChild(li);
//     }
//     return ul;
// }

// // drag and drop

// const dropArea = document.getElementById('dropArea');

// // Prevent default behaviors (prevent file from being opened)
// ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//     dropArea.addEventListener(eventName, preventDefaults, false);
//     document.body.addEventListener(eventName, preventDefaults, false);
// });

// // Highlight the drop area when file is dragged over
// ['dragenter', 'dragover'].forEach(eventName => {
//     dropArea.addEventListener(eventName, highlight, false);
// });

// // Remove highlight when dragging leaves the drop area
// ['dragleave', 'drop'].forEach(eventName => {
//     dropArea.addEventListener(eventName, unhighlight, false);
// });

// // Handle dropped files
// dropArea.addEventListener('drop', handleDrop, false);

// // Prevent default behavior
// function preventDefaults(e) {
//     e.preventDefault();
//     e.stopPropagation();
// }

// function highlight() {
//     dropArea.classList.add('highlight');
// }

// function unhighlight() {
//     dropArea.classList.remove('highlight');
// }

// function handleDrop(e) {
//     const dt = e.dataTransfer;
//     const file = dt.files[0];

//     if (file && file.type === 'application/json') {
//         const reader = new FileReader();

//         reader.onload = function(e) {
//             const jsonData = e.target.result;
//             if (jsonData.length <= 15000){
//                 document.getElementById('jsonInput').value = jsonData;
//                 renderButton();
//             } else {
//                 console.log("overflowerror drag drop")
//                 jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">Max length of 15000 characters.</p>`
//             }
//         };

//         reader.readAsText(file);
//     } else {
//         jsonOutput.style.display = 'block';
//         jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">Please drop a valid JSON file.</p>`;
//     }
// }
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

    jsonOutput.style.display = 'block';

    try {
        const jsonData = JSON.parse(jsonInput);
        jsonOutput.innerHTML = '';
        jsonOutput.appendChild(createNestedList(jsonData));
        expandButton.disabled = false;
    } catch (e) {
        jsonOutput.innerHTML = `<p style="color: red; font-weight: bold;">Invalid JSON: ${e.message}</p>`;
        expandButton.disabled = true;
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

function createNestedList(data) {
    const ul = document.createElement('ul');
    for (const key in data) {
        const li = document.createElement('li');

        if (typeof data[key] === 'object' && data[key] !== null) {
            const toggleButton = document.createElement('span');
            toggleButton.textContent = '[+]';
            toggleButton.classList.add('toggle-btn');

            const nestedList = createNestedList(data[key]);
            nestedList.style.display = 'none';

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
            li.textContent = `${key}: ${data[key]}`;
        }

        ul.appendChild(li);
    }
    return ul;
}
