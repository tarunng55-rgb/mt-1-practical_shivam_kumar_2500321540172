
const http = require('http');
const fs = require('fs');

let books = [
    { id: 1, title: "Harry Potter", author: "J.K. Rowling", category: "Fantasy" },
    { id: 2, title: "Wings of Fire", author: "APJ Abdul Kalam", category: "Biography" },
    { id: 3, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction" },
    { id: 4, title: "Atomic Habits", author: "James Clear", category: "Self Help" }
];

const server = http.createServer((req, res) => {

    if (req.url === '/' && req.method === 'GET') {
        fs.readFile(__dirname + '/index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('File Not Found');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    }

    else if (req.url === '/style.css' && req.method === 'GET') {
        fs.readFile(__dirname + '/style.css', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('CSS Not Found');
            } else {
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.end(data);
            }
        });
    }

    else if (req.url === '/books' && req.method === 'GET') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(books));
    }

    else if (req.url === '/books' && req.method === 'POST') {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            let book = JSON.parse(data);
            books.push(book);

            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Book Added Successfully');
        });
    }

    else if (req.url.startsWith('/books/') && req.method === 'PUT') {
        let id = Number(req.url.split('/')[2]);
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            let updatedBook = JSON.parse(data);

            books = books.map(book =>
                book.id === id ? {id, ...updatedBook} : book
            );

            res.end('Book Updated Successfully');
        });
    }

    else if (req.url.startsWith('/books/') && req.method === 'DELETE') {
        let id = Number(req.url.split('/')[2]);

        books = books.filter(book => book.id !== id);

        res.end('Book Deleted Successfully');
    }

    else {
        res.writeHead(404);
        res.end('Page Not Found');
    }

});

server.listen(3000, () => {
    console.log("Server running at port 3000");
});
