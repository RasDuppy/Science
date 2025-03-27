// Automatically load the CSV file on page load
document.addEventListener("DOMContentLoaded", () => {
  // Load the CSV file using PapaParse
  Papa.parse("elements.csv", {
    download: true, // Fetch the file from the server
    header: true, // Use the first row as headers
    dynamicTyping: true, // Automatically convert numbers
    complete: function (results) {
      const elements = results.data; // Parsed CSV data
      populateTable(elements); // Display the table
      setupColorCoding(elements); // Enable color coding
    },
  });
});

/**
 * Populate the periodic table dynamically based on CSV data.
 * @param {Array} elements - Array of element objects from the CSV file.
 */
function populateTable(elements) {
  const container = document.getElementById("table-container");
  container.innerHTML = ""; // Clear existing content

  // Loop through each element and create a block
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
    const gridColumn = element.Group || 1; // Default column
    const gridRow = element.Period || 1; // Default row
    cell.style.gridColumn = gridColumn;
    cell.style.gridRow = gridRow;

    container.appendChild(cell); // Add to the container
  });
}

/**
 * Setup the dropdown menu for color coding.
 * @param {Array} elements - Array of element objects from the CSV file.
 */
function setupColorCoding(elements) {
  const dropdown = document.getElementById("property-select");

  // Listen for changes in the dropdown
  dropdown.addEventListener("change", (event) => {
    const property = event.target.value; // Selected property
    applyColorCoding(elements, property);
  });
}

/**
 * Apply color coding based on the selected property.
 * @param {Array} elements - Array of element objects from the CSV file.
 * @param {string} property - Property to use for color coding.
 */
function applyColorCoding(elements, property) {
  const container = document.getElementById("table-container");
  const blocks = container.children;

  // Normalize the property values for coloring
  const values = elements.map((el) => parseFloat(el[property])).filter((v) => !isNaN(v));
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Map each block's color based on its property value
  Array.from(blocks).forEach((block, index) => {
    const value = parseFloat(elements[index][property]);
    if (!isNaN(value)) {
      const ratio = (value - min) / (max - min); // Scale to [0, 1]
      const color = `rgb(${Math.floor(255 * (1 - ratio))}, ${Math.floor(255 * ratio)}, 150)`; // Gradient from red to green
      block.style.background = color; // Apply color
    }
  });
}
