window.addEventListener( 'load', function () {
    const urlParams = new URLSearchParams( window.location.search );
    var searchFilter = urlParams.get( 'filter' ).trim();

    if ( !searchFilter || searchFilter == "" ) {
        searchFilter = "";
        document.getElementById( "search_title" ).innerHTML = "Tous les documents:";
    } else {
        var searchFilterSpan = document.getElementById( "search_filter" );
        searchFilterSpan.innerHTML = '"' + searchFilter + '"';
    }

    searchAndShowFiles( searchFilter );
} );

/**
 * Recherche une chaîne de caractères dans les noms des fichiers de la BDD et
 * affiche les fichiers correspondant dans le tableau de résultats
 *
 * @param {string} searchFilter - Le filtre de recherche
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function searchAndShowFiles ( searchFilter ) {
    var allFilesRequest = getAllFilesFromStore();
    allFilesRequest.onsuccess = function () {
        var results = [];
        this.result.forEach( file => {
            if ( file.fileName.toLowerCase().indexOf( searchFilter.toLowerCase() ) > -1 ) {
                results.push( file );
            }
        } );
        showFileResults( results );
    };
}

/**
 * Affiche les fichiers dans le tableau de résultats
 *
 * @param {Array} files - La liste des fichiers
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function showFileResults ( files ) {
    var table = document.getElementById( "results_table" ).getElementsByTagName( "tbody" )[ 0 ];

    while ( table.children.length > 0 ) {
        table.children[ 0 ].remove();
    }

    files.forEach( file => {
        var fileRow = table.insertRow( -1 );

        var fileName = fileRow.insertCell( -1 );
        fileName.innerHTML = file.fileName;

        var fileYear = fileRow.insertCell( -1 );
        fileYear.innerHTML = file.fileYear;

        var fileLevel = fileRow.insertCell( -1 );
        fileLevel.innerHTML = file.fileLevel;

        var fileSemester = fileRow.insertCell( -1 );
        fileSemester.innerHTML = file.fileSemester;

        var fileModule = fileRow.insertCell( -1 );
        fileModule.innerHTML = file.fileModule;

        var fileDownload = fileRow.insertCell( -1 );
        var fileLink = document.createElement( "a" );
        fileLink.href = URL.createObjectURL( file.fileObject );
        fileLink.download = file.fileName;
        fileLink.innerHTML = FILE_TYPES[ file.fileObject.type ];
        fileDownload.appendChild( fileLink );

        var fileUploadDate = fileRow.insertCell( -1 );
        var localDate = new Date( file.fileUploadDate );
        fileUploadDate.innerHTML = localDate.toLocaleString( 'fr-FR' );

        var fileDelete = fileRow.insertCell( -1 );
        fileDelete.style.border = "none";
        var deleteButton = document.createElement( "button" );
        deleteButton.type = "button";
        deleteButton.classList.add( "delete-button" );
        deleteButton.onclick = function () {
            if ( confirm( 'Êtes-vous sûr(e) de vouloir supprimer "' + file.fileName + '" ?' ) ) {
                deleteFileFromStore( file.fileName );
                document.location.reload();
            }
        };
        var deleteButtonImg = document.createElement( "img" );
        deleteButtonImg.classList.add( "delete-button-img" );
        deleteButtonImg.src = "assets/trash-alt-solid.svg";
        deleteButton.appendChild( deleteButtonImg );
        fileDelete.appendChild( deleteButton );
    } );
}
