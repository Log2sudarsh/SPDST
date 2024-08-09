document.addEventListener("DOMContentLoaded", function () {
    const headers = document.querySelectorAll('.table thead th');
    const filterInputs = document.querySelectorAll('.filter-input');
    const tableBody = document.querySelector('table tbody');

    // Adjust the width of filter inputs based on header text length
    headers.forEach((header, index) => {
        const textLength = header.innerText.length;
        const input = filterInputs[index];

        if (input) {
            const minWidth = 6; // Set a minimum width in characters for very short headers
            input.style.width = `${Math.max(textLength + 2, minWidth)}ch`; // Adjust width based on header text length

            input.addEventListener('input', function () {
                filterTable(); // Call the filter function on input change
            });
        }
    });

    // Fetch and populate table data
    function loadData() {
        fetch('/api/donations/report')
            .then(response => response.json())
            .then(data => {
                populateTable(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Populate table with data
    function populateTable(data) {
        tableBody.innerHTML = ''; // Clear existing data

        data.forEach(row => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${row.userId}</td>
                <td>${row.nameKn}</td>
                <td>${row.place}</td>
                <td>${row.contactNo}</td>
                <td>${row.pledgeAmount}</td>
                <td>${row.userType}</td>
                <td>${row.donatedAmount}</td>
                <td>${row.receiptNo}</td>
                <td>${row.paymentStatus}</td>
                <td>${row.receiptType}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Filter table rows based on input values
    function filterTable() {
        const filters = Array.from(filterInputs).map(input => input.value.toLowerCase());
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const match = filters.every((filter, i) => {
                return cells[i].innerText.toLowerCase().includes(filter);
            });
            row.style.display = match ? '' : 'none';
        });
    }

    // Load initial data
    loadData();
});
