document.addEventListener('DOMContentLoaded', function () {
    fetchAndRenderDonations();

    // Function to fetch and render donations
    function fetchAndRenderDonations() {
        fetch('/api/donations')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('donationsTable').getElementsByTagName('tbody')[0];
                tableBody.innerHTML = ''; // Clear existing rows

                data.forEach(user => {
                    if (user.donations.length > 0) {
                        const firstDonation = user.donations[0];
                        const row = tableBody.insertRow();
                        row.innerHTML = `
                            <td>${user.user_Id}</td>
                            <td><a href="#" class="donation-link" data-user-id="${user.user_Id}">${user.name_Kn}</a></td>
                            <td>${user.name_En}</td>
                            <td>${user.place}</td>
                            <td>${user.contact_No}</td>
                            <td>${user.pledge_Amount}</td>
                            <td>
                                <button class="btn btn-primary btn-sm edit-button" data-user-id="${user.user_Id}">Edit</button>
                            </td>
                        `;
                    }
                });

                // Add event listener for donation links
                document.querySelectorAll('.donation-link').forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                        const userId = this.getAttribute('data-user-id');
                        const user = data.find(user => user.user_Id == userId);

                        // Set user details in the modal
                        document.getElementById('modalNameKn').textContent = user.name_Kn;
                        document.getElementById('modalPlace').textContent = user.place;
                        document.getElementById('modalContactNo').textContent = user.contact_No;
                        document.getElementById('modalPledgeAmount').textContent = user.pledge_Amount;

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
                                <td>${new Date(donation.pay_Date).toLocaleDateString()}</td>
                                <td>${donation.pay_Mode}</td>
                                <td>${donation.transaction_No}</td>
                            `;
                            i++;
                        });

                        $('#donationsModal').modal('show');
                    });
                });

                // Add event listener for edit buttons
                document.querySelectorAll('.edit-button').forEach(button => {
                    button.addEventListener('click', function () {
                        const userId = this.getAttribute('data-user-id');
                        const user = data.find(user => user.user_Id == userId);

                        // Populate the edit form with user details
                        document.getElementById('editUserId').value = user.userId;
                        document.getElementById('editUserNameEn').value = user.name_En;
                        document.getElementById('editUserNameKn').value = user.name_Kn;
                        document.getElementById('editUserPlace').value = user.place;
                        document.getElementById('editUserContactNo').value = user.contact_No;
                        document.getElementById('editUserPledgeAmount').value = user.pledge_Amount;
                        document.getElementById('editUserId').value = user.user_Id;

                        $('#editUserModal').modal('show');
                    });
                });
            })
            .catch(error => console.error('Error fetching donations:', error));
    }

    // Save edited user details
    document.getElementById('saveEditUser').addEventListener('click', function () {
        const userId = document.getElementById('editUserId').value;
        const updatedUser = {
            user_Id: document.getElementById('editUserId').value,
            name_En: document.getElementById('editUserNameEn').value,
            name_Kn: document.getElementById('editUserNameKn').value,
            place: document.getElementById('editUserPlace').value,
            contact_No: document.getElementById('editUserContactNo').value,
            pledge_Amount: document.getElementById('editUserPledgeAmount').value,
            created_By: 'Admin',
            created_On: Date.now,
            modified_By: 'Admin',
            modified_On: Date.now
        };

        console.log(JSON.stringify(updatedUser));

        fetch(`/api/donations/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
            .then(response => response.json())
            .then(updatedUser => {
                // Hide the modal
                $('#editUserModal').modal('hide');

                // Reload the table data
                fetchAndRenderDonations();
            })
            .catch(error => console.error('Error updating user:', error));
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