function toggleSidebar(event) {
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === '-250px') {
        sidebar.style.left = '0';
        sidebar.style.zIndex = '10';
    } else {
        sidebar.style.left = '-250px';
        sidebar.style.zIndex = '1';

        window.addEventListener('click', function closeMenu(e) {
            if (!sidebar.contains(e.target) && !menuButton.contains(e.target)) {
                sidebar.style.left = '-250px';
                window.removeEventListener('click', closeMenu);
    }
});

}

}

function contactPeople(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (name && email && message) {
        const contactData = {
            name: name,
            email: email,
            message: message,
            date: new Date().toLocaleString()
        };

        let existingMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        existingMessages.push(contactData);
        localStorage.setItem('contactMessages', JSON.stringify(existingMessages));

        alert(`Adam wil get back to your shortly!\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
        
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
    } else {
        alert('Please fill in all fields');
    }
}

function handleVisitorSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const country = document.getElementById('country').value;
    const date = document.getElementById('visitDate').value;
    
    if (name && country && date) {
        const table = document.getElementById('visitorTable').getElementsByTagName('tbody')[0];
        const rowCount = table.getElementsByTagName('tr').length;
        const columnCount = table.getElementsByTagName('tr')[0]?.getElementsByTagName('td').length || 0;
        
        if (rowCount % 5 === 0 && rowCount !== 0) {
            table.querySelectorAll('tr').forEach(row => {
                const cell = document.createElement('td');
                row.appendChild(cell);
            });
        }
        
        let targetRow;
        if (rowCount % 5 === 0 || rowCount === 0) {
            targetRow = table.insertRow();
        } else {
            targetRow = table.rows[rowCount - 1];
        }
        
        const cell = targetRow.insertCell();
        cell.innerHTML = `${name}<br>${country}<br>${date}`;
        
        document.getElementById('name').value = '';
        document.getElementById('country').value = '';
        document.getElementById('visitDate').value = '';
    }
}
