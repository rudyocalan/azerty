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

function deleteFileFromStore(fileName) {
    var db = request.result;
    var tx = db.transaction("docs", "readwrite");
    var store = tx.objectStore("docs");

    store.delete(fileName);
}