document.addEventListener('DOMContentLoaded', function () {
    const loading = document.getElementById('loading');
    const tableBody = document.getElementById('donationsTable').getElementsByTagName('tbody')[0];
    const totalPaidElement = document.getElementById('totalPaid');
    const totalPendingElement = document.getElementById('totalPending');
    const totalAmountElement = document.getElementById('totalAmount');
    const sortIcon = document.getElementById('sortIcon');
    const sortIcon2 = document.getElementById('sortIcon2');
    const generateReceiptBtn = document.getElementById('generateReceiptBtn');


    let totalPaid = 0;
    let totalPending = 0;
    let totalAmount = 0;
    let isAscending = true; // Track sort direction
    let donationData = []; // Store fetched data for sorting

    function showLoading() {
        loading.style.display = 'block';
    }

    function hideLoading() {
        loading.style.display = 'none';
    }

    function renderTable(data) {
        tableBody.innerHTML = ''; // Clear existing table rows
        var j = 0;
        data.forEach(user => {
            j++;
            if (user.donations.length >= 0) {
                user.donations.forEach(donation => {
                    totalAmount += donation.donated_Amount;
                    if (donation.payment_Status) {
                        totalPaid += donation.donated_Amount;
                    } else {
                        totalPending += donation.donated_Amount;
                    }
                });
              
                const firstDonation = user.donations[0];
                const paymentStatusClass = firstDonation.payment_Status
                    ? 'background-color:green;color:white;border-radius:300px;padding:5px;text-align:center;'
                    : 'background-color:red;color:white;border-radius:300px;padding:5px;text-align:center;';

                const noOfDonationStyle = 'width:35px; margin-left:3px;margin-top:4px; background-color:#1044c2;padding:1px;border-radius:5px;text-align:center;color:white; font-size:7pt;';
                const numberOfDonations = user.donations.length;

                const row = tableBody.insertRow();

                row.innerHTML = `
                    <td>${j}</td>
                    <td><a href="#" class="donation-link" data-user-id="${user.user_Id}">${user.name_Kn}</a></td>
                    <td>${user.pledge_Amount == 0 ? '' : user.pledge_Amount}</td>
                    <td>
                      <a href="#" class="donation-link" style="${paymentStatusClass}" data-user-id="${user.user_Id}">${user.total_Donated_Amount} </a><div style="${noOfDonationStyle}">${numberOfDonations} ಕಂತು</div>
                    </td>
                    <td style='display:none;'>${user.name_En}</td>
                `;
              
            }
          
        });

        // Update the summary elements with the calculated values
        totalPaidElement.textContent = totalPaid;
        totalPendingElement.textContent = totalPending;
        totalAmountElement.textContent = totalAmount;

        // Add event listener for donation links
        document.querySelectorAll('.donation-link').forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                const userId = this.getAttribute('data-user-id');
                const user = donationData.find(user => user.user_Id == userId);

                // Set user details in the modal
                document.getElementById('modalUserId').textContent = user.user_Id;
                document.getElementById('modalNameKn').textContent = user.name_Kn;
                document.getElementById('modalPlace').textContent = user.place;
                document.getElementById('modalContactNo').textContent = '-'; // user.contact_No;
                document.getElementById('modalPledgeAmount').textContent = '-'; // user.pledge_Amount;

                // Populate donation details in the modal
                const detailedTableBody = document.getElementById('detailedDonationsTable').getElementsByTagName('tbody')[0];
                detailedTableBody.innerHTML = ''; // Clear previous details
                var i = 1;
                user.donations.forEach(donation => {
                    console.log('donation'); console.log(donation);
                    const row = detailedTableBody.insertRow();
                    row.innerHTML = `
                        <td>ಕಂತು ${i}</td>
                        <td>${donation.donated_Amount}</td>
                        <td>${donation.receipt_No}</td>
                        <td>-</td>
                        <td>${donation.pay_Mode}</td>
                        <td>${donation.transaction_No}</td>
                        <td>${donation.payment_Status ? 'Paid' : 'Pending'}</td>
                    `;
                    i = i + 1;
                });

                $('#donationsModal').modal('show');
            });
        });
        j = j + 1;
    }

    function convertNumberToKannadaWords(amount) {
        var units = [
            "", "ಒಂದು", "ಎರಡು", "ಮೂರು", "ನಾಲ್ಕು", "ಐದು", "ಆರು", "ಏಳು", "ಎಂಟು", "ಒಂಬತ್ತು", "ಹತ್ತು",
            "ಹನ್ನೊಂದು", "ಹನ್ನೆರಡು", "ಹದಿಮೂರು", "ಹದಿನಾಲ್ಕು", "ಹದಿನೈದು", "ಹದಿನಾರು", "ಹದಿನೇಳು", "ಹದಿನೆಂಟು", "ಹತ್ತೊಂಬತ್ತು"
        ];
        var tens = [
            "", "", "ಇಪ್ಪತ್ತು", "ಮುವತ್ತು", "ನಲವತ್ತು", "ಐವತ್ತು", "ಅರವತ್ತು", "ಎಪ್ಪತ್ತು", "ಎಂಬತ್ತು", "ತೊಂಬತ್ತು"
        ];
        var scales = ["", "ಸಾವಿರ", "ಲಕ್ಷ", "ಕೋಟಿ", "ಬಿಲಿಯನ್"];

        // Function to convert a number less than 1000 to words
        function convertHundreds(num) {
            var hundred = Math.floor(num / 100);
            var remainder = num % 100;
            var result = "";

            if (hundred) {
                result += units[hundred] + " ನೂರು ";
            }

            if (remainder) {
                if (remainder < 20) {
                    result += units[remainder];
                } else {
                    var ten = Math.floor(remainder / 10);
                    var unit = remainder % 10;
                    result += tens[ten] + " " + units[unit];
                }
            }

            return result.trim();
        }

        if (amount === 0) return "ಶೂನ್ಯ";

        var words = "";
        var scaleIndex = 0;

        while (amount > 0) {
            var num = amount % 1000;
            if (num !== 0) {
                var scaleWord = scales[scaleIndex] ? " " + scales[scaleIndex] : "";
                words = convertHundreds(num) + scaleWord + " " + words;
            }
            amount = Math.floor(amount / 1000);
            scaleIndex++;
        }

        return words.trim();
    }

    // Convert the amount to words (for simplicity, using a basic function)
    function convertNumberToWords1(amount) {
        var units = [
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
        ];
        var tens = [
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        ];
        var scales = ["", "Thousand", "Million", "Billion", "Trillion"];

        // Function to convert a number less than 1000 to words
        function convertHundreds(num) {
            var hundred = Math.floor(num / 100);
            var remainder = num % 100;
            var result = "";

            if (hundred) {
                result += units[hundred] + " Hundred ";
            }

            if (remainder) {
                if (remainder < 20) {
                    result += units[remainder];
                } else {
                    var ten = Math.floor(remainder / 10);
                    var unit = remainder % 10;
                    result += tens[ten] + " " + units[unit];
                }
            }

            return result.trim();
        }

        if (amount === 0) return "Zero";

        var words = "";
        var scaleIndex = 0;

        while (amount > 0) {
            var num = amount % 1000;
            if (num !== 0) {
                var scaleWord = scales[scaleIndex] ? " " + scales[scaleIndex] : "";
                words = convertHundreds(num) + scaleWord + " " + words;
            }
            amount = Math.floor(amount / 1000);
            scaleIndex++;
        }

        return words.trim();
    }
    function generateReceipt1(donationsData) {
     
        // Use the first donation record for this example
        var donation = donationsData[0].donations[0];

        // Populate the receipt with JSON data       
        document.getElementById("receiptNo").textContent = donation.receipt_No;
        document.getElementById("receiptDate").textContent = new Date(donation.pay_Date).toLocaleDateString();
        document.getElementById("donerName").textContent = donationsData[0].name_Kn;
        document.getElementById("amountInNo").textContent = donation.donated_Amount;
        var amtWords = convertNumberToKannadaWords(donation.donated_Amount);
        document.getElementById("amountInWords").textContent = amtWords;
        console.log('amtWords'); console.log(amtWords);
        // Display the receipt (you might want to print or append to the DOM)
        var receiptHtml = document.getElementById("receiptTemplate").innerHTML;
        var newWindow = window.open("", "Receipt", "width=800,height=600");
        newWindow.document.write(receiptHtml);
        newWindow.document.close();
        newWindow.print(); // Optionally trigger print dialog
    }

    function generateReceipt(donationsData) {
        // Iterate through each user in the donationsData array
        donationsData.forEach(user => {
            // Iterate through each donation for the current user
            user.donations.forEach(donation => {
                // Populate the receipt with the current donation data
                document.getElementById("receiptNo").textContent = donation.receipt_No;
                document.getElementById("receiptDate").textContent = new Date(donation.pay_Date).toLocaleDateString();
                document.getElementById("donerName").textContent = user.name_Kn;
                document.getElementById("amountInNo").textContent = donation.donated_Amount;

                // Convert the donated amount to words
                var amtWords = convertNumberToKannadaWords(donation.donated_Amount);
                document.getElementById("amountInWords").textContent = amtWords;
                console.log('amtWords:', amtWords);

                // Create a new window for each receipt
                var receiptHtml = document.getElementById("receiptTemplate").innerHTML;
                var newWindow = window.open("", "Receipt", "width=800,height=600");
                newWindow.document.write(receiptHtml);
                newWindow.document.close();

                // Optionally trigger print dialog for each receipt
                newWindow.print();
            });
        });
    }


    function sortTable(data) {
        data.sort((a, b) => {
            if (isAscending) {
                return a.total_Donated_Amount - b.total_Donated_Amount;


            } else {
                return b.total_Donated_Amount - a.total_Donated_Amount;
            }
        });

        // Toggle sort direction for next click
        isAscending = !isAscending;

        // Update the sort icon to reflect the current sort direction
        sortIcon.textContent = isAscending ? '▲' : '▼';

        // Re-render the table with the sorted data
        renderTable(data);
    }

    function sortTable2(data) {
        data.sort((a, b) => {
            if (isAscending) {
                return a.pledge_Amount - b.pledge_Amount;


            } else {
                return b.pledge_Amount - a.pledge_Amount;
            }
        });

        // Toggle sort direction for next click
        isAscending = !isAscending;

        // Update the sort icon to reflect the current sort direction
        sortIcon2.textContent = isAscending ? '▲' : '▼';

        // Re-render the table with the sorted data
        renderTable(data);
    }

    showLoading();

    fetch('/api/donations')
        .then(response => response.json())
        .then(data => {
            donationData = data; // Store the data for sorting
            renderTable(donationData); // Render the initial table
            hideLoading();
        })
        .catch(error => {
            console.error('Error fetching donations:', error);
            hideLoading();
        });

    // Add click event listener for sorting
    sortIcon.addEventListener('click', () => {
        sortTable(donationData);       
    });

    sortIcon2.addEventListener('click', () => {       
        sortTable2(donationData);
    });

    generateReceiptBtn.addEventListener('click', () => {
        generateReceipt(donationData)
    });


});

function searchTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toLowerCase();
    table = document.getElementById("donationsTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}
