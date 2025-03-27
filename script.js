// Automatically load the CSV file on page load
document.addEventListener("DOMContentLoaded", () => {
  Papa.parse("elements.csv", {
    download: true, // Fetch the file from the server
    header: true, // Use the first row as headers
    dynamicTyping: true, // Automatically convert numbers
    complete: function (results) {
      const elements = results.data; // Parsed CSV data
      if (elements.length > 0) {
        populateTable(elements); // Display the table
        setupColorCoding(elements); // Enable color coding
      } else {
        console.error("No data found in elements.csv.");
      }
    },
    error: function (error) {
      console.error("Error parsing CSV file:", error);
    },
  });
});

// Populate the periodic table
function populateTable(elements) {
  const container = document.getElementById("table-container");
  container.innerHTML = ""; // Clear existing content

  elements.forEach((element) => {
    const cell = document.createElement("div");
    cell.classList.add("element");

    // Add content to the element block
    cell.innerHTML = `
      <div class="atomic-number">${element.AtomicNumber}</div>
      <div class="symbol">${element.Symbol}</div>
      <div class="name">${element.Name}</div>
    `;

    // Position the block in the grid using Group and Period
    const gridColumn = element.Group || 1;
    const gridRow = element.Period || 1;
    cell.style.gridColumn = gridColumn;
    cell.style.gridRow = gridRow;

    // Add click event to open modal
    cell.addEventListener("click", () => {
      openModal(element); // Open the modal with the clicked element's data
    });

    container.appendChild(cell);
  });
}

// Setup the color coding dropdown
function setupColorCoding(elements) {
  const dropdown = document.getElementById("property-select");

  dropdown.addEventListener("change", (event) => {
    const property = event.target.value;
    applyColorCoding(elements, property);
  });
}

// Apply color coding based on a selected property
function applyColorCoding(elements, property) {
  const container = document.getElementById("table-container");
  const blocks = container.children;

  const values = elements.map((el) => parseFloat(el[property])).filter((v) => !isNaN(v));
  const min = Math.min(...values);
  const max = Math.max(...values);

  Array.from(blocks).forEach((block, index) => {
    const value = parseFloat(elements[index][property]);
    if (!isNaN(value)) {
      const ratio = (value - min) / (max - min);
      const color = `rgb(${Math.floor(255 * (1 - ratio))}, ${Math.floor(255 * ratio)}, 150)`;
      block.style.background = color;
    } else {
      block.style.background = "gray";
    }
  });
}

// Open the modal to display element info
function openModal(element) {
  const modal = document.getElementById("element-info-modal");
  const name = document.getElementById("element-name");
  const atomicNumber = document.getElementById("atomic-number");
  const symbol = document.getElementById("symbol");
  const atomicWeight = document.getElementById("atomic-weight");
  const electronegativity = document.getElementById("electronegativity");

  // Set the modal content
  name.innerText = element.Name;
  atomicNumber.innerText = element.AtomicNumber;
  symbol.innerText = element.Symbol;
  atomicWeight.innerText = element.AtomicWeight;
  electronegativity.innerText = element.Electronegativity;

  // Show the modal
  modal.style.display = "block";
}

// Close the modal when the close button is clicked
document.getElementById("close-modal").addEventListener("click", () => {
  const modal = document.getElementById("element-info-modal");
  modal.style.display = "none";
});

// Close the modal if the user clicks anywhere outside of it
window.onclick = function (event) {
  const modal = document.getElementById("element-info-modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
