document.addEventListener('DOMContentLoaded', function () {
    const loading = document.getElementById('loading');
    const tableBody = document.getElementById('donationsTable').getElementsByTagName('tbody')[0];

    const totalPaidElement = document.getElementById('totalPaid');
    const totalPendingElement = document.getElementById('totalPending');
    const totalAmountElement = document.getElementById('totalAmount');

    let totalPaid = 0;
    let totalPending = 0;
    let totalAmount = 0;

    function showLoading() {
        loading.style.display = 'block';
    }

    function hideLoading() {
        loading.style.display = 'none';
    }

    showLoading();

    fetch('/api/donations')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
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
                    const row = tableBody.insertRow();

                    // Determine the color class based on the first donation's payment status
                    const paymentStatusClass = firstDonation.payment_Status ? 'background-color:green;color:white;border-radius:300px;padding:5px;text-align:center;' : 'background-color:red;color:white;border-radius:300px;padding:5px;text-align:center;';

                    const noOfDonationStyle ='margin-left:5px; background-color:#1044c2;padding:1px;border-radius:5px;text-align:center;color:white; font-size:7pt;'
                    const numberOfDonations = user.donations.length;
                   

                    row.innerHTML = `
                               <td>${user.user_Id}</td>
                               <td><a href="#" class="donation-link" data-user-id="${user.user_Id}">${user.name_Kn}</a></td>
                               <td>-</td>
                               <td><a href="#" class="donation-link" style="${paymentStatusClass}" data-user-id="${user.user_Id}">${user.total_Donated_Amount}</a>
                                 <span style="${noOfDonationStyle}">${numberOfDonations}ಕಂತು</span>
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
                    const user = data.find(user => user.user_Id == userId);

                    // Set user details in the modal
                    document.getElementById('modalNameKn').textContent = user.name_Kn;
                    document.getElementById('modalPlace').textContent = user.place;
                    document.getElementById('modalContactNo').textContent = '-';//user.contact_No;
                    document.getElementById('modalPledgeAmount').textContent = '-';// user.pledge_Amount;

                    // Populate donation details in the modal
                    const detailedTableBody = document.getElementById('detailedDonationsTable').getElementsByTagName('tbody')[0];
                    detailedTableBody.innerHTML = ''; // Clear previous details
                    var i = 1;
                    user.donations.forEach(donation => {
                        const row = detailedTableBody.insertRow();
                        row.innerHTML = `
                                        <td>ಕಂತು ${i}</td>
                                        <td>${donation.donated_Amount}</td>
                                        <td>${donation.receipt_No}</td>
                                        <td>-</td>
                                        <td>${donation.pay_Mode}</td>
                                        <td>${donation.transaction_No}</td>
                                        <td>${donation.payment_Status?'Paid':'Pending'}</td>
                                    `;
                        i = i + 1;
                    });

                    $('#donationsModal').modal('show');
                });
            });

            hideLoading(); // Hide loading icon after data is loaded
        })
        .catch(error => {
            console.error('Error fetching donations:', error);
            hideLoading(); // Hide loading icon in case of error
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
