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
        const table = this.#books.map(book => {
            return {
                Title: book.getTitle,
                Author: book.getAuthor,
                Year: book.getYear,
                Status: book.getIsIssued ? 'Issued' : 'Not issued',
                Type: book.constructor === EBook ? 'EBook' : 'Book',
                Format: book.constructor === EBook ? book.getFormat : '-' 
            };
        });
        console.table(table);
    }
}



console.log("\n\nHello to my small lybrary!\n");
const library = new Library();

function tryFunction(callback) {
    try {
        callback();
    } catch (error) {
        console.error("Error:", error.message);
    }
}

tryFunction(() => library.addBook(new EBook("Дракула", "Брэм Стокер", 1897, 571, "mof")));
tryFunction(() => library.addBook(new Book("Благословение Небожителя", "Мосян Тунсю", 2017)));
tryFunction(() => library.addBook(new Book("Магистр дьявольского культа", "Мосян Тунсю", 2015, true)));
tryFunction(() => library.addBook(new Book("Убийца Шута", 123, 2015)));
tryFunction(() => library.addBook(new EBook("Хребты безумия", "Говард Лавкрафт", 1936, 480, "epub")));
tryFunction(() => library.addBook(new EBook("Странствия шута", "Роби Хобб", 2015, 2, "mobi")));

tryFunction(() => {
    const book1 = library.findBook("1984");
    console.log(`Find book: ${book1.getTitle}`); 
});

tryFunction(() => {
    const book2 = library.findBook("Мосян Тунсю", 2017);
    console.log(`Find book: ${book2.getTitle}`); 
    book2.toggleIssue();
});

library.listAllBooks();
