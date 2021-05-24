// This works on all devices/browsers, and uses IndexedDBShim as a final fallback
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Open (or create) the database
var request = indexedDB.open("efreiCompanion", 1);
var db;

// Create the schema
request.onupgradeneeded = function () {
    db = request.result;
    db.createObjectStore("docs", { keyPath: "fileName" });
};

request.onsuccess = function (event) {
    db = event.target.result;
};

function addFileToStore(file) {
    var db = request.result;
    var tx = db.transaction("docs", "readwrite");
    var store = tx.objectStore("docs");

    store.put(file);
}

function getFileFromStore(fileName) {
    var db = request.result;
    var tx = db.transaction("docs", "readonly");
    var store = tx.objectStore("docs");

    var file = store.get(fileName);

    return file;
}

function getAllFilesFromStore() {
    var db = request.result;
    var tx = db.transaction("docs", "readonly");
    var store = tx.objectStore("docs");

    var files = store.getAll();

    return files;
}

// window.addEventListener('load', function () {
    // addFileToStore({ fileName: "Screen Shot 2021-03-s10 at 6.12.27 PM.png", s: 's' });
    // getFileFromStore("Screen Shot 2021-03-s10 at 6.12.27 PM.png");
// });

// open.onsuccess = function () {
//     // Start a new transaction
//     var db = open.result;
//     var tx = db.transaction("efreiCompanion", "readwrite");
//     var store = tx.objectStore("efreiCompanion");

//     // Add some data
//     store.put({ id: 12345, name: { first: "John", last: "Doe" }, age: 42 });
//     store.put({ id: 67890, name: { first: "Bob", last: "Smith" }, age: 35 });

//     // Query the data
//     var getJohn = store.get(12345);

//     getJohn.onsuccess = function () {
//         console.log(getJohn.result.name.first);  // => "John"
//     };

//     // Close the db when the transaction is done
//     tx.oncomplete = function () {
//         db.close();
//     };
// };