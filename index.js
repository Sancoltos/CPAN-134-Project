function toggleSidebar(event) {
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === '-250px') {
        sidebar.style.left = '0';
    } else {
        sidebar.style.left = '-250px';

        window.addEventListener('click', function closeMenu(e) {
            if (!sidebar.contains(e.target) && !menuButton.contains(e.target)) {
                sidebar.style.left = '-250px';
                window.removeEventListener('click', closeMenu);
    }
});

}

}
