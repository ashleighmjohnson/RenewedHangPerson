async function menu() {
    const response = await fetch('/menu');
    if (response.ok) {
        const menuItems = await response.json();
        const menuList = document.getElementById('menu');
        menuItems.forEach(menu => {
            const div = document.createElement('div');
            div.textContent = menu.menu;
            div.style.color = '#fff';
            div.style.cursor = 'pointer';
            div.onclick = () => {
                window.location.href = menu.link;
            };
            menuList.appendChild(div);
        });
    } else {
        alert('Failed to load words');
    }
}