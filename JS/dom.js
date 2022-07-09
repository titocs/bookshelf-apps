const books = []
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKS_MEMO';

// Modals
const modals = document.querySelector(".modals");
const cancelButton = document.getElementById("cancel-button");
const confirmButton = document.getElementById("confirm-button");

const deleteButton = document.getElementById("delete-button");
const doneButton = document.getElementById("done-button");

// ------------ END MODALS -------------- //

function generateId(){
    return +new Date();
}

function generateBooksObject(id, title, author, year, isCompleted){
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
}

function findBook(bookId){
    for(const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId){
    for(const index in books){
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert("Tidak mendukung local storage");
        return false;
    }
    return true;
}

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null){
        for(const book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function insertBooks(bookObject){
    const {id, title, author, year, isCompleted} = bookObject;

    const bookContainer = document.createElement("div");
    bookContainer.classList.add("books-container", "flex", "mb-4", "items-center", "p-3", "border", "rounded-lg", "border-[#5C423A]", "lg:p-5")
    bookContainer.setAttribute("id", `book-${id}`);
    
    const bookDescription = document.createElement('div');
    bookDescription.classList.add("book-desc");

    const titleBook = document.createElement('h1');
    titleBook.classList.add('font-bold');
    titleBook.innerHTML = title;

    const authorBook = document.createElement('p');
    authorBook.classList.add('text-xs');
    authorBook.innerHTML = `Penulis: ${author}`;

    const yearBook = document.createElement('p');
    yearBook.classList.add('text-xs');
    yearBook.innerHTML = `Tahun: ${year}`;

    bookDescription.append(titleBook, authorBook, yearBook)
    bookContainer.append(bookDescription);
    
    if(!isCompleted){ /* Belum selesai */
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('ml-auto');

        bookContainer.append(buttonDiv);

        const tombolSelesai = document.createElement('button');
        tombolSelesai.setAttribute('id', 'done-button');
        tombolSelesai.innerHTML = `
            <svg class="w-4 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path class="fill-[#5C423A]" d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/>
            </svg>
        `
        tombolSelesai.addEventListener("click", function(){
            addBookToComplete(id);
        })

        const tombolDelete = document.createElement('button');
        tombolDelete.classList.add("ml-3", "lg:ml-5");
        tombolDelete.setAttribute('id', 'delete-button');
        tombolDelete.innerHTML = `
            <svg class="w-4 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path class="fill-[#5C423A]" d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"/>
            </svg>
        `
        tombolDelete.addEventListener("click", function(){
            modals.removeAttribute("hidden");
            cancelButton.addEventListener("click", function(){
                modals.setAttribute("hidden", true);
            })
            confirmButton.addEventListener("click", function(){
                removeBookFromCompleted(id);
                modals.setAttribute("hidden", true);
            })
        })
        buttonDiv.append(tombolSelesai, tombolDelete);
    }
    else{ // kalo udah selesai
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('ml-auto');

        bookContainer.append(buttonDiv);

        const tombolUndo = document.createElement('button');
        tombolUndo.setAttribute('id', 'undo-button');
        tombolUndo.innerHTML = `
            <svg class="w-4 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path class="fill-[#5C423A]" d="M480 256c0 123.4-100.5 223.9-223.9 223.9c-48.84 0-95.17-15.58-134.2-44.86c-14.12-10.59-16.97-30.66-6.375-44.81c10.59-14.12 30.62-16.94 44.81-6.375c27.84 20.91 61 31.94 95.88 31.94C344.3 415.8 416 344.1 416 256s-71.69-159.8-159.8-159.8c-37.46 0-73.09 13.49-101.3 36.64l45.12 45.14c17.01 17.02 4.955 46.1-19.1 46.1H35.17C24.58 224.1 16 215.5 16 204.9V59.04c0-24.04 29.07-36.08 46.07-19.07l47.6 47.63C149.9 52.71 201.5 32.11 256.1 32.11C379.5 32.11 480 132.6 480 256z"/>
            </svg>
        `
        tombolUndo.addEventListener("click", function(){
            undoBookFromComplete(id);
        })

        const tombolDelete = document.createElement('button');
        tombolDelete.classList.add("ml-3", "lg:ml-5");
        tombolDelete.setAttribute('id', 'delete-button');
        tombolDelete.innerHTML = `
            <svg class="w-4 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path class="fill-[#5C423A]" d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"/>
            </svg>
        `
        tombolDelete.addEventListener("click", function(){
            modals.removeAttribute("hidden");
            cancelButton.addEventListener("click", function(){
                modals.setAttribute("hidden", true);
            })
            confirmButton.addEventListener("click", function(){
                removeBookFromCompleted(id);
                modals.setAttribute("hidden", true);
            })
        })
        buttonDiv.append(tombolUndo, tombolDelete);
    }
    return bookContainer;
}

function createBooks(){
    const judul = document.getElementById('judul').value;
    const author = document.getElementById('author').value;
    const years = document.getElementById('years').value;
    const isCompleted = document.getElementById('check').checked;

    const generatedId = generateId();
    const bookObject = generateBooksObject(generatedId, judul, author, years, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToComplete(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null)
        return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1)
        return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromComplete(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null)
        return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

/* --------------- DOM EVENT SERIES ----------------- */
document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("form-submit");
    submitForm.addEventListener("submit", function(event){
        event.preventDefault();
        createBooks();
    });
    if(isStorageExist()){
        loadDataFromStorage();
    }
})

document.addEventListener(SAVED_EVENT, function(){
    console.log("Data berhasil disimpan");
})

document.addEventListener(RENDER_EVENT, function(){
    const uncompletedBooks = document.getElementById('section-belum-dibaca');
    const listCompletedBooks = document.getElementById('section-sudah-dibaca');

    uncompletedBooks.innerHTML = '';
    listCompletedBooks.innerHTML = '';

    for(const bookItem of books){
        const bookElement = insertBooks(bookItem);
        if(bookItem.isCompleted){
            listCompletedBooks.append(bookElement);
        }
        else{
            uncompletedBooks.append(bookElement);
        }
    }
})

const cariBuku = document.getElementById("find-book-button");
cariBuku.addEventListener("click", function(event){
    event.preventDefault();
    const inputSearchBook = document.getElementById("filter").value;
    const uncompletedBooks = document.getElementById('section-belum-dibaca');
    const listCompletedBooks = document.getElementById('section-sudah-dibaca');

    const findBook = [];
    const textPattern = new RegExp(inputSearchBook, 'i');

    uncompletedBooks.innerHTML = '';
    listCompletedBooks.innerHTML = '';

    if(inputSearchBook === ''){
        for(const bookItem of books){
            const bookElement = insertBooks(bookItem);
            if(bookItem.isCompleted){
                listCompletedBooks.append(bookElement);
            }
            else{
                uncompletedBooks.append(bookElement);
            }
        }
    }
    else{
        for(let i=0; i<books.length; i++){
            // Kalo salah satu karakter atau lebih ada di Inputan
            if(textPattern.test(books[i].title)){
                findBook.push(books[i]);
            }
        }
        for(const bookItem of findBook){
            const bookElement = insertBooks(bookItem);
            if(bookItem.isCompleted){
                listCompletedBooks.append(bookElement);
            }
            else{
                uncompletedBooks.append(bookElement);
            }
        }
    }
})