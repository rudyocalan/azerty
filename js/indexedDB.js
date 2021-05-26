// Assigne indexedDB en fonction du navigateur
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Ouvre ou créé la base de données IndexedDB
var request = indexedDB.open( "efreiCompanion", 1 );
var db;

// Lorsque la BDD est créée, assigne db au résultat et créé le store
request.onupgradeneeded = function () {
    db = request.result;
    db.createObjectStore( "docs", { keyPath: "fileName" } );
};

request.onsuccess = function ( event ) {
    db = event.target.result;
};

/**
 * Ajouter un fichier dans la BDD
 *
 * @param {Object} file - L'objet du fichier qui doit être ajouté
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function addFileToStore ( file ) {
    var db = request.result;
    var tx = db.transaction( "docs", "readwrite" );
    var store = tx.objectStore( "docs" );

    store.put( file );
}

/**
 * Récupère un fichier de la BDD à partir de son nom
 *
 * @param {string} fileName - Le nom du fichier demandé
 *
 * @return {Object} - L'objet du fichier demandé
 */
function getFileFromStore ( fileName ) {
    var db = request.result;
    var tx = db.transaction( "docs", "readonly" );
    var store = tx.objectStore( "docs" );

    var file = store.get( fileName );

    return file;
}

/**
 * Récupère tous les fichiers de la BDD
 *
 * @return {IDBRequest} - La requête à la BDD, elle doit se terminer avant de pouvoir lire les résultats
 */
function getAllFilesFromStore () {
    var db = request.result;
    var tx = db.transaction( "docs", "readonly" );
    var store = tx.objectStore( "docs" );

    var files = store.getAll();

    return files;
}

/**
 * Supprime un fichier de la BDD
 *
 * @param {string} fileName - Le nom du fichier qui doit être supprimé
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function deleteFileFromStore ( fileName ) {
    var db = request.result;
    var tx = db.transaction( "docs", "readwrite" );
    var store = tx.objectStore( "docs" );

    store.delete( fileName );
}