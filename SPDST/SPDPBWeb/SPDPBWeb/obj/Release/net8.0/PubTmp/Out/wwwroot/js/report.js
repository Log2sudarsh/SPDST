document.addEventListener("DOMContentLoaded", function () {
    const filterMenuToggle = document.getElementById('filter-menu-toggle');
    const filterForm = document.getElementById('filter-form');
    const filterSection = document.getElementById('filter-section');
    const filterInputs = filterForm.querySelectorAll('input[type="text"]');
    const radioInputs = filterForm.querySelectorAll('input[type="radio"]');
    const cardsContainer = document.getElementById('cards-container');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const filterPledgeAmount = document.getElementById('filterPledgeAmount');

    // Toggle filter form visibility
    filterMenuToggle.addEventListener('click', function () {
        filterForm.style.display = filterForm.style.display === 'none' ? 'block' : 'none';
        filterSection.style.display = filterSection.style.display === 'none' ? 'block' : 'none';       
    });

    // Fetch and populate cards with data
    function loadData() {
        fetch('/api/donations/report')
            .then(response => response.json())
            .then(data => {
                populateCards(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Populate cards with data
    function populateCards(data) {
        cardsContainer.innerHTML = ''; // Clear existing data
        var i = 1;
        data.forEach(row => {
            const card = document.createElement('div');
            card.className = 'card col-md-6 ml-2 mr-2 bg-color-style';

            card.innerHTML = `
                <div class="card-body" style="line-height:28px;">
                    <h6 class="card-title">${i}. ${row.nameKn}</h6> 
                    <p class="card-text">  
                    ${row.nameEn}<br>
                        <strong>ಸ್ಥಳ:</strong> ${row.place}<br>
                        <strong>ಸಂಪರ್ಕ ಸಂಖ್ಯೆ:</strong> ${row.contactNo === 9999999999 ? '' : row.contactNo}<br>
                        <strong>ವಾಗ್ದಾನದ ಮೊತ್ತ:</strong> ${row.pledgeAmount === 0 ? '' : row.pledgeAmount}<br>
                        <strong>ದಾನಿಗಳ ವಿಧ:</strong> ${row.userType === 'F' ? 'Farmer' : 'Employee'}<br>
                        <strong>ದೇಣಿಗೆ ಮೊತ್ತ:</strong> ${row.donatedAmount}<br>
                        <strong>ರಶೀದಿ ಸಂಖ್ಯೆ:</strong> ${row.receiptNo}<br>
                        <strong>ಪಾವತಿ ಸ್ಥಿತಿ:</strong> ${row.paymentStatus === true ? 'Paid' : 'Pending'}<br>
                        <strong>ರಶೀದಿ ವಿಧ:</strong> ${row.receiptType}
                    </p>
                </div>
            `;
            cardsContainer.appendChild(card);
            i++;
        });
    }

    // Filter cards based on input values
    function filterCards() {
        const filters = Array.from(filterInputs).map(input => input.value.toLowerCase());
        const radioFilters = {
            userType: document.querySelector('input[name="userType"]:checked')?.value.toLowerCase(),
            paymentStatus: document.querySelector('input[name="paymentStatus"]:checked')?.value.toLowerCase(),
            receiptType: document.querySelector('input[name="receiptType"]:checked')?.value.toLowerCase(),
        };

        const cards = cardsContainer.querySelectorAll('.card');

        cards.forEach(card => {
            const cardText = card.innerText.toLowerCase();
            const matchesFilters = filters.every(filter => cardText.includes(filter));
            const matchesRadioFilters = Object.keys(radioFilters).every(key => {
                return !radioFilters[key] || cardText.includes(radioFilters[key]);
            });

            card.style.display = (matchesFilters && matchesRadioFilters) ? '' : 'none';
        });
    }

    // Apply filter on input change
    filterInputs.forEach(input => {
        input.addEventListener('input', filterCards);
    });

    radioInputs.forEach(radio => {
        radio.addEventListener('change', filterCards);
    });

    // Clear all filters
    clearFiltersBtn.addEventListener('click', function () {
        filterInputs.forEach(input => input.value = '');
        radioInputs.forEach(radio => radio.checked = false);
        
        filterCards();
    });

    // Load initial data
    loadData();
});