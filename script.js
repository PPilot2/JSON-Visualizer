document.getElementById('renderBtn').addEventListener('click', function() {
    const jsonInput = document.getElementById('jsonInput').value;

    try {
        const jsonData = JSON.parse(jsonInput);
        document.getElementById('jsonOutput').innerHTML = '';
        renderJson(jsonData, document.getElementById('jsonOutput'));
    } catch (e) {
        document.getElementById('jsonOutput').innerText = 'Invalid JSON: ' + e.message;
    }
});

function renderJson(jsonData, container) {
    const ul = document.createElement('ul');

    for (const key in jsonData) {
        const li = document.createElement('li');
        li.textContent = key + ': ';

        if (typeof jsonData[key] === 'object' && jsonData[key] !== null) {
            li.classList.add('collapsible');
            const childContainer = document.createElement('div')
            childContainer.style.display = 'none'; // Initially hide child nodes
            li.appendChild(childContainer);
            renderJson(jsonData[key], childContainer); // Recursively render child nodes

            li.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent event bubbling
                childContainer.style.display = childContainer.style.display === 'none' ? 'block' : 'none';
            });
        } else {
            li.textContent += jsonData[key]; // Display value for primitive types
        }

        ul.appendChild(li);
    }

    container.appendChild(ul);
}