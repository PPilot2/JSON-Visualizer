const csvOutput = document.getElementById('csvOutput');
csvOutput.style.display = 'none';
let defaultRowCount = 10; // Set default row count

function renderCSV() {
    const csvInput = document.getElementById('csvInput').value;
    const expandButton = document.getElementById('expandButton');
    csvOutput.style.display = 'block';

    try {
        let csvData = csvInput.split('\n').map(row => row.split(','));
        csvOutput.innerHTML = ''; 
        csvOutput.appendChild(createTable(csvData));

        expandButton.disabled = false;
    } catch (e) {
        csvOutput.innerHTML = `<p style="color: red; font-weight: bold;">Invalid CSV: ${e.message}</p>`;
        expandButton.disabled = true;
    }
}

function createTable(data) {
    const table = document.createElement('table');
    table.classList.add('csv-table'); // Add a class for CSS styling

    // Add row numbering and limit displayed rows
    data.slice(0, defaultRowCount).forEach((row, rowIndex) => {
        const tr = document.createElement('tr');

        // Create a row number column
        const rowNumberCell = document.createElement('th');
        rowNumberCell.textContent = rowIndex + 1; // Row number
        tr.appendChild(rowNumberCell);

        // Populate the rest of the columns
        row.forEach(cell => {
            const td = document.createElement(rowIndex === 0 ? 'th' : 'td');
            td.textContent = cell.trim();
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    // Add "Load More" functionality if data exceeds defaultRowCount
    if (data.length > defaultRowCount) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.textContent = "Load More";
        loadMoreBtn.onclick = () => {
            defaultRowCount += 10; // Increase row count by 10
            renderCSV(); // Re-render the table with more rows
        };
        csvOutput.appendChild(loadMoreBtn);
    }

    return table;
}

document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        if (file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvData = e.target.result;
                document.getElementById('csvInput').value = csvData;
                renderCSV();
            };
            reader.readAsText(file);
        } else {
            csvOutput.style.display = 'block';
            csvOutput.innerHTML = `<p style="color: red; font-weight: bold;">Please upload a valid CSV file.</p>`;
        }
    } else {
        csvOutput.style.display = 'block';
        csvOutput.innerHTML = `<p style="color: red; font-weight: bold;">No file selected. Please upload a file.</p>`;
    }
});

// Drag and drop functionality (same as before)
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

function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }
function highlight() { dropArea.classList.add('highlight'); }
function unhighlight() { dropArea.classList.remove('highlight'); }

function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];

    if (file && file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvData = e.target.result;
            document.getElementById('csvInput').value = csvData;
            renderCSV();
        };
        reader.readAsText(file);
    } else {
        csvOutput.style.display = 'block';
        csvOutput.innerHTML = `<p style="color: red; font-weight: bold;">Please drop a valid CSV file.</p>`;
    }
}
