class Book {
    #title;
    #author;
    #year;
    #isIssued;

    constructor(title, author, year, isIssued = false) {
        if (typeof title !== 'string') {
            throw new Error(`Book (${title}): Incorrect type of Title (must be string)`);
        }

        if (typeof author !== 'string') {
            throw new Error(`Book (${title}): Incorrect type of Author (must be string)`);
        }

        if (typeof year !== 'number') {
            throw new Error(`Book (${title}): Incorrect type of Year (must be number)`);
        }

        this.#title = title;
        this.#author = author;
        this.#year = year;
        this.#isIssued = isIssued;

        Object.defineProperty(this, 'getIsIssued', {
            get: () => this.#isIssued,
            set: (value) => {
                if (typeof value === 'boolean') {
                    this.#isIssued = value;
                } else {
                    throw new Error('isIssued must be a boolean value.');
                }
            },
            enumerable: true,
            configurable: false
        });
    }

    get getTitle() {
        return this.#title;
    }

    get getAuthor() {
        return this.#author;
    }

    get getYear() {
        return this.#year;
    }

    toggleIssue() {
        this.#isIssued = !this.#isIssued;
    }
}

class EBook extends Book {
    #fileSize;
    #format;

    constructor(title, author, year, fileSize, format) {
        if (typeof fileSize !== 'number' || fileSize <= 0) {
            throw new Error(`Book (${title}): Incorrect type of FileSize (must be positive number)`);
        }

        if (typeof format !== 'string' || !['pdf', 'mobi', 'epub'].includes(format)) {
            throw new Error(`Book (${title}): Incorrect type of Format (must be string: mobi, epub or pdf)`);
        }

        super(title, author, year);
        this.#fileSize = fileSize;
        this.#format = format;
    }

    get getFormat() {
        return this.#format;
    }

    get getFileSize() {
        return this.#fileSize;
    }

    toggleIssue() {
        console.log("EBooks are always allowed.");
    }
}

class Library {
    #books;

    constructor() {
        this.#books = [];
    }

    addBook(book) {
        if (book instanceof Book) {
            this.#books.push(book);
        } else {
            throw new Error("Invalid book type.");
        }
    }

    findBook(arg1, arg2) {
        if (typeof arg1 === 'string' && arg2 === undefined) {
            const book = this.#books.find(book => book.getTitle === arg1);
            if (book) {
                return book;
            } else {
                throw new Error(`Book (${arg1}) was not found by title.`);
            }
        } else if (typeof arg1 === 'string' && typeof arg2 === 'number') {
            const book = this.#books.find(book => book.getAuthor === arg1 && book.getYear === arg2);
            if (book) {
                return book;
            } else {
                throw new Error(`Book was not found by author (${arg1}) and year (${arg2}).`);
            }
        } else {
            throw new Error("Incorrect data to find book.");
        }
    }

    listAllBooks() {
        return this.#books.map(book => ({
            Title: book.getTitle,
            Author: book.getAuthor,
            Year: book.getYear,
            Status: book.getIsIssued ? 'Issued' : 'Not issued',
            Type: book instanceof EBook ? 'EBook' : 'Book',
            Format: book instanceof EBook ? book.getFormat : '-'
        }));
    }
}

const library = new Library();

document.getElementById('bookForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value);
    const isIssued = document.getElementById('isIssued').checked;
    const isEBook = document.getElementById('isEBook').checked;
    const fileSize = parseFloat(document.getElementById('fileSize').value);
    const format = document.getElementById('format').value;

    try {
        let book;
        if (isEBook) {
            if (!fileSize || !format) {
                throw new Error("For EBook write fileSize and format.");
            }
            book = new EBook(title, author, year, fileSize, format);
        } else {
            book = new Book(title, author, year, isIssued);
        }
        library.addBook(book);
        updateBookTable();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

function updateBookTable() {
    const tableBody = document.querySelector('#bookTable tbody');
    tableBody.innerHTML = '';

    library.listAllBooks().forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.Title}</td>
            <td>${book.Author}</td>
            <td>${book.Year}</td>
            <td>${book.Status}</td>
            <td>${book.Type}</td>
            <td>${book.Format}</td>
        `;
        tableBody.appendChild(row);
    });
}