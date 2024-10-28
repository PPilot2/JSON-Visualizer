const csvOutput = document.getElementById('csvOutput');
csvOutput.style.display = 'none';
let defaultRowCount = 50; // Set default row count

function submitPrompt() {
    const prompt = document.getElementById("popupInput").value;

    fetch("/generate_csv", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
        // Assuming renderCSV expects a string of CSV data
        renderCSV(data.csv_data);
        const csvTextArea = document.getElementById("csvInput");
        csvTextArea.value = data.csv_data;
        document.getElementById('popupOverlay').style.display = 'none';
    })
    .catch(error => console.error("Error:", error));
}

// Open and close popup
document.getElementById('openPopupButton').onclick = function() {
    document.getElementById('popupOverlay').style.display = 'flex';
};

document.getElementById('closePopupButton').onclick = function() {
    document.getElementById('popupOverlay').style.display = 'none';
};


function renderCSV(csvData) {
    csvOutput.style.display = 'block';

    try {
        const parsedData = Papa.parse(csvData, {
            header: false, // Header is treated as the first row
            skipEmptyLines: true
        });

        // Pass the parsed data to the table rendering function
        csvOutput.innerHTML = ''; 
        csvOutput.appendChild(createTable(parsedData.data));
    } catch (e) {
        csvOutput.innerHTML = `<p style="color: red; font-weight: bold;">Invalid CSV: ${e.message}</p>`;
    }
}

function createTable(data) {
    const table = document.createElement('table');
    table.classList.add('csv-table'); // Add a class for CSS styling

    data.slice(0, defaultRowCount).forEach((row, rowIndex) => {
        const tr = document.createElement('tr');

        // Add row number column
        const rowNumberCell = document.createElement('th');
        rowNumberCell.textContent = rowIndex + 1;
        tr.appendChild(rowNumberCell);

        // Populate the rest of the columns
        row.forEach(cell => {
            const td = document.createElement(rowIndex === 0 ? 'th' : 'td');
            td.textContent = cell.trim();
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    if (data.length > defaultRowCount) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.classList.add('csv-table-btn');
        loadMoreBtn.textContent = "Load More";
        loadMoreBtn.onclick = () => {
            defaultRowCount += 10;
            renderCSV(document.getElementById('csvInput').value);
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
                renderCSV(csvData);
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

// Drag and drop functionality
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

let fileInputTriggered = false; // Flag to prevent double trigger

// Stop event propagation on click in the drop area to avoid the file input opening twice
dropArea.addEventListener('click', function(event) {
    if (!fileInputTriggered) {
        document.getElementById('file-input').click();
        fileInputTriggered = true; // Set the flag
    }
    event.stopPropagation(); // Prevent event from bubbling up
});

// Reset flag after file input action completes
document.getElementById('file-input').addEventListener('click', function(event) {
    fileInputTriggered = false; // Reset flag after the file input is clicked
});

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
            renderCSV(csvData); // Pass csvData directly
        };
        reader.readAsText(file);
    } else {
        csvOutput.style.display = 'block';
        csvOutput.innerHTML = `<p style="color: red; font-weight: bold;">Please drop a valid CSV file.</p>`;
    }
}

function downloadCSV() {
    const csvData = document.getElementById('csvInput').value;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date();
    let dateText = date.toDateString();
    a.download = 'download ' + dateText + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
