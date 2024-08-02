// addUserScript.js
document.addEventListener('DOMContentLoaded', function () {
    const addUserForm = document.getElementById('addUserForm');
    addUserForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const newUser = {
            user_Id=10,
            name_Kn: document.getElementById('nameKn').value,
            name_En: document.getElementById('nameEn').value,
            place: document.getElementById('place').value,
            contact_No: document.getElementById('contactNo').value,
            pledge_Amount: document.getElementById('pledgeAmount').value,
            created_By: 'Admin',
            created_On: new Date().toISOString(),
            modified_By: 'Admin',
            modified_On: new Date().toISOString()
        };

        console.log(newUser);

        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(response => {
                if (response.ok) {
                    alert('User added successfully!');
                    addUserForm.reset();
                } else {
                    alert('Failed to add user.');
                }
            })
            .catch(error => console.error('Error adding user:', error));
    });
});
