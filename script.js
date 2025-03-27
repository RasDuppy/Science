// Attach an event listener to the file input to handle file uploads
document.getElementById('csv-input').addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      // Use PapaParse to read the CSV file
      Papa.parse(file, {
        header: true, // Treat the first row as column headers
        dynamicTyping: true, // Convert numeric values to numbers automatically
        complete: function (results) {
          populateTable(results.data); // Pass the parsed data to the populateTable function
        },
      });
    }
  });
  
  // Function to generate the periodic table dynamically
  function populateTable(elements) {
    const container = document.getElementById('table-container'); // Get the container
    container.innerHTML = ''; // Clear any existing content
  
    // Get the selected color property from the dropdown
    const colorProperty = document.getElementById('color-dropdown').value;
  
    // Loop through each element in the data
    elements.forEach((element) => {
      const cell = document.createElement('div'); // Create a new div for each element
      cell.classList.add('element'); // Add the "element" class for styling
  
      // Add content to the element block
      cell.innerHTML = `
        <div class="atomic-number">${element['Atomic Number']}</div> <!-- Atomic number -->
        <div class="symbol">${element.Symbol}</div> <!-- Chemical symbol -->
        <div class="name">${element.Name}</div> <!-- Element name -->
      `;
  
      // Position the block based on the group (column) and period (row)
      const gridColumn = element.Group || 1; // Default to 1 if no group is provided
      const gridRow = element.Period || 1; // Default to 1 if no period is provided
      cell.style.gridColumn = gridColumn; // Set the column in the grid
      cell.style.gridRow = gridRow; // Set the row in the grid
  
      // Dynamically set the background color based on the selected property
      const colorValue = element[colorProperty];
      const color = getColorForProperty(colorValue);
      cell.style.backgroundColor = color; // Set the color for the element
  
      container.appendChild(cell); // Add the block to the container
    });
  }
  
  // Function to get a color based on the value of the selected property
  function getColorForProperty(value) {
    if (value === undefined || value === null) {
      return "#ddd"; // Default color for undefined or null values
    }
  
    // Example: Normalize and map the value to a color range
    if (typeof value === "number") {
      const hue = (value * 10) % 360; // Create a hue based on the value
      return `hsl(${hue}, 100%, 60%)`; // Return a color based on hue
    }
  
    // Default color if it's not a number
    return "#ccc";
  }
  
  // Attach an event listener to the dropdown to re-render the table when the property is changed
  document.getElementById('color-dropdown').addEventListener('change', () => {
    const fileInput = document.getElementById('csv-input');
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          populateTable(results.data); // Re-render with the updated color property
        },
      });
    }
  });
  