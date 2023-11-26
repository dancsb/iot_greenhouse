const html = document.querySelector('html');

initialState = localStorage.getItem('darkmode');
if(initialState == null)
    initialState = true;
else
    initialState = initialState == 'true';
    
function setTheme(theme) {
    html.setAttribute('data-bs-theme', theme ? 'dark' : 'light');
}

if(!initialState)
    setTheme(false);

function toggleDarkMode(checked) {
    setTheme(checked);
    localStorage.setItem('darkmode', checked);
}

function setButtonState() {
    const toggle = document.querySelector('.toggle-input');
    toggle.checked = initialState;
}