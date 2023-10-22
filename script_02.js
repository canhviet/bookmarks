const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmarks-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookamrksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

//Show Modal, Focus on Inpput
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

//Modal event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal')); 
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

//Validate Form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue) {
        alert('please submit values for both fiels. ');
        return false;
    }
    if(urlValue.match(regex)) {
        alert('match');
    }
    if(!urlValue.match(regex)) {
        alert('please provide a valid web address');
        return false;
    }
    return true;
}

//Build Bookmarks DOM
function buildBookmarks() {
    //Remove all bookmark elements
    bookamrksContainer.textContent = '';
    Object.keys(bookmarks).forEach((id) => {
        const { name, url } = bookmarks[id];
        const item = document.createElement('div');
        item.classList.add('item');
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `favicon.png`);
        favicon.setAttribute('alt', 'Favicon');
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookamrksContainer.appendChild(item);
    });
}

//Fetch Bookmarks
function fetchBookmarks() {
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    else {
        const id = `https://codepen.io/Dimasion/pen/oBoqBM`
        bookmarks[id] = {
            name: 'Shopping cart JS',
            url: 'https://codepen.io/Dimasion/pen/oBoqBM',
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

//Delete Bookmark
function deleteBookmark(id) {
    if(bookmarks[id]) {
        delete bookmarks[id];
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}
// Handle Data from Form
function storeBookmark(e) {
    // e.preventDefaut();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`; 
    }
    validate(nameValue, urlValue);
    if(!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

//On Load
fetchBookmarks();