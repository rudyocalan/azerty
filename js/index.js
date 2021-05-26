var uploadedFiles = {};

window.addEventListener( 'load', function () {
    document.getElementById( "input" ).onchange = uploadFiles;
    showRecentFiles( 5 );
} );

/**
 * Garde en mémoire les fichiers que l'utilisateur a sélectionnés dans la variable 'uploadedFiles',
 * ajoute ces fichiers dans le tableau "Déposer des documents" et
 * affiche le formulaire utilisateur et le tableau des fichiers téléchargés.
 *
 * @param {Event} event - L'évènement ayant enclenché l'appel de cette fonction
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function uploadFiles ( event ) {
    if ( event.target.files.length == 0 ) {
        return;
    }
    for ( let index = 0; index < event.target.files.length; index++ ) {
        const file = event.target.files[ index ];
        uploadedFiles[ file.name ] = {
            fileObject: file,
            fileLevel: '',
            fileSemester: '',
            fileModule: '',
            fileYear: '',
            fileName: file.name,
            fileUploadDate: Date.now()
        };
        addFileToTable( file );
    }
    document.getElementById( "uploaded_section" ).style.display = "unset";
}

/**
 * Retourne l'élément HTML <tr> auquel appartient l'élément HTML <select>
 *
 * @param {HTMLSelectElement} selectElement - L'élément <select> pour lequel le parent <table> est demandé
 *
 * @return {HTMLTableRowElement} - L'élément <tr> auquel appartient 'selectElement'
 */
function getTableRowFromSelect ( selectElement ) {
    return selectElement.parentElement.parentElement;
}

/**
 * Créé et retourne un élément HTML <select> avec une option par défaut
 *
 * @param {string} default_option - Le texte de l'option par défaut
 *
 * @return {HTMLSelectElement} - L'élément <select> nouvellement créé
 */
function createEmptySelect ( default_option ) {
    var selectElement = document.createElement( 'select' );

    var optionElement = document.createElement( 'option' );
    optionElement.innerHTML = default_option;
    optionElement.value = '';

    selectElement.appendChild( optionElement );

    return selectElement;
}

/**
 * Créé et retourne l'élément HTML <select> pour le choix du niveau d'étude
 * lors du dépot de documents
 *
 * @return {HTMLSelectElement} - L'élément <select> nouvellement créé
 */
function createFileLevelSelect () {
    var selectElement = createEmptySelect( "--Choisissez le niveau d'étude--" );
    selectElement.onchange = function () {
        changeFileLevelSelect( this );
    };

    for ( let index = 0; index < STUDY_LEVELS.length; index++ ) {
        const year = STUDY_LEVELS[ index ];

        var optionElement = document.createElement( 'option' );
        optionElement.appendChild( document.createTextNode( year ) );
        optionElement.value = year;

        if ( year != 'L2' ) {
            optionElement.disabled = true;
        }

        selectElement.appendChild( optionElement );
    }

    return selectElement;
}

/**
 * Créé et retourne l'élément HTML <select> pour le choix de l'année d'étude
 * lors du dépot de documents
 *
 * @return {HTMLSelectElement} - L'élément <select> nouvellement créé
 */
function createFileYearSelect () {
    var selectElement = createEmptySelect( "--Choisissez l'année du document--" );
    selectElement.onchange = function () {
        changeFileYearSelect( this );
    };

    const currentYear = new Date().getFullYear();
    for ( let year = currentYear; year >= 2000; --year ) {
        var optionElement = document.createElement( 'option' );
        optionElement.appendChild( document.createTextNode( year ) );
        optionElement.value = year;
        selectElement.appendChild( optionElement );
    }

    return selectElement;
}

/**
 * Modifie les options de l'élément HTML <select> pour le choix du niveau d'étude
 * lors du dépot de documents
 *
 * @param {HTMLSelectElement} selectElement - L'élément <select> du choix du niveau d'étude
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function changeFileLevelSelect ( selectElement ) {
    var fileLevel = selectElement.value;

    var tableRow = getTableRowFromSelect( selectElement );
    var fileName = tableRow.cells[ 0 ].innerHTML;
    uploadedFiles[ fileName ].fileLevel = fileLevel;

    var semesterSelect = tableRow.cells[ 3 ].childNodes[ 0 ];
    while ( semesterSelect.children[ 1 ] != null ) {
        semesterSelect.children[ 1 ].remove();
    }

    if ( fileLevel == '' ) {
        semesterSelect.options[ 0 ].innerHTML = "--Choisissez d'abord le niveau d'étude--";
    } else {
        semesterSelect.options[ 0 ].innerHTML = "--Choisissez le semestre d'étude--";
        SEMESTERS[ fileLevel ].forEach( semester => {
            var optionElement = document.createElement( 'option' );
            optionElement.innerHTML = semester;
            optionElement.value = semester;
            semesterSelect.add( optionElement );
        } );
    }

    changeFileSemesterSelect( semesterSelect );
}

/**
 * Modifie les options de l'élément HTML <select> pour le choix du semestre d'étude
 * lors du dépot de documents
 *
 * @param {HTMLSelectElement} selectElement - L'élément <select> du choix du semestre d'étude
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function changeFileSemesterSelect ( selectElement ) {
    var fileSemester = selectElement.value;

    var tableRow = getTableRowFromSelect( selectElement );
    var fileName = tableRow.cells[ 0 ].innerHTML;
    uploadedFiles[ fileName ].fileSemester = fileSemester;

    var moduleSelect = tableRow.cells[ 4 ].childNodes[ 0 ];
    while ( moduleSelect.children[ 1 ] != null ) {
        moduleSelect.children[ 1 ].remove();
    }

    if ( fileSemester == '' ) {
        moduleSelect.options[ 0 ].innerHTML = "--Choisissez d'abord le semestre d'étude--";
    } else {
        moduleSelect.options[ 0 ].innerHTML = "--Choisissez le module d'étude--";
        MODULES[ fileSemester ].forEach( semesterModules => {
            var optgroupElement = document.createElement( 'optgroup' );
            optgroupElement.label = semesterModules[ 0 ];

            for ( let index = 1; index < semesterModules.length; index++ ) {
                const module = semesterModules[ index ];

                var optionElement = document.createElement( 'option' );
                optionElement.innerHTML = semesterModules[ index ];
                optionElement.value = semesterModules[ index ];

                optgroupElement.appendChild( optionElement );
            }

            moduleSelect.add( optgroupElement );
        } );
    }

    changeFileModuleSelect( moduleSelect );
}

/**
 * Enregistre le choix du module d'étude sélectionnée par l'utilisateur lors du dépot de documents
 * dans le fichier correspondant dans la variable 'uploadedFiles'
 *
 * @param {HTMLSelectElement} selectElement - L'élément <select> du choix du module d'étude
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function changeFileModuleSelect ( selectElement ) {
    var fileModule = selectElement.value;

    var tableRow = getTableRowFromSelect( selectElement );
    var fileName = tableRow.cells[ 0 ].innerHTML;
    uploadedFiles[ fileName ].fileModule = fileModule;
}

/**
 * Enregistre le choix de l'année du document sélectionnée par l'utilisateur lors du dépot de documents
 * dans le fichier correspondant dans la variable 'uploadedFiles'
 *
 * @param {HTMLSelectElement} selectElement - L'élément <select> du choix de l'année du document
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function changeFileYearSelect ( selectElement ) {
    var fileYear = selectElement.value;

    var tableRow = getTableRowFromSelect( selectElement );
    var fileName = tableRow.cells[ 0 ].innerHTML;
    uploadedFiles[ fileName ].fileYear = fileYear;
}

/**
 * Affiche le fichier dans le tableau des documents téléchargés
 *
 * @param {File} file - Le fichier téléchargé par l'utilisateur
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function addFileToTable ( file ) {
    var table = document.getElementById( "uploaded_table" ).getElementsByTagName( 'tbody' )[ 0 ];
    var fileRow = table.insertRow( -1 );

    var fileName = fileRow.insertCell( -1 );
    fileName.innerHTML = file.name;

    var fileType = fileRow.insertCell( -1 );
    fileType.innerHTML = FILE_TYPES[ file.type ];

    var fileLevel = fileRow.insertCell( -1 );
    fileLevel.appendChild( createFileLevelSelect( file.name ) );

    var fileSemester = fileRow.insertCell( -1 );
    var fileSemesterSelect = createEmptySelect( "--Choisissez d'abord le niveau d'étude--" );
    fileSemesterSelect.onchange = function () {
        changeFileSemesterSelect( this );
    };
    fileSemester.appendChild( fileSemesterSelect );

    var fileModule = fileRow.insertCell( -1 );
    var fileModuleSelect = createEmptySelect( "--Choisissez d'abord le semestre d'étude--" );
    fileModuleSelect.onchange = function () {
        changeFileModuleSelect( this );
    };
    fileModule.appendChild( fileModuleSelect );

    var fileYear = fileRow.insertCell( -1 );
    fileYear.appendChild( createFileYearSelect( file.name ) );


    var fileDelete = fileRow.insertCell( -1 );
    fileDelete.style.border = "none";
    var deleteButton = document.createElement( "button" );
    deleteButton.type = "button";
    deleteButton.classList.add( "delete-button" );
    deleteButton.onclick = function () {
        deleteFileFromUploadedFiles( file.name );
    };
    var deleteButtonImg = document.createElement( "img" );
    deleteButtonImg.classList.add( "delete-button-img" );
    deleteButtonImg.src = "assets/trash-alt-solid.svg";
    deleteButton.appendChild( deleteButtonImg );
    fileDelete.appendChild( deleteButton );
}

/**
 * Enregistre les fichiers téléchargés par l'utilisateur dans la base de données IndexedDB du navigateur,
 * alerte l'utilisateur si une information manque et empêche l'enregistrement,
 * efface tous les fichiers du tableau de documents téléchargés,
 * cache le formulaire et le tableau de documents et
 * met à jour le tableau de documents récents.
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function saveUploadedFiles () {
    for ( const fileName in uploadedFiles ) {
        for ( const fileInfo in uploadedFiles[ fileName ] ) {
            if ( uploadedFiles[ fileName ][ fileInfo ] == '' ) {
                alert( "Veuillez renseigner toutes les informations pour pouvoir enregistrer les documents." );
                return;
            }
        }
    }

    var user = {};
    var user_infos = [ "user_firstname", "user_lastname", "user_class", "user_promotion" ];
    for ( let index = 0; index < user_infos.length; index++ ) {
        const user_info = user_infos[ index ];
        var element = document.getElementById( user_info );
        if ( element.value.trim() == "" ) {
            alert( "Veuillez renseigner toutes les informations pour pouvoir enregistrer les documents." );
            return;
        }
        user[ user_info ] = element.value.trim();
    }

    for ( const fileName in uploadedFiles ) {
        uploadedFiles[ fileName ][ 'user' ] = user;
        addFileToStore( uploadedFiles[ fileName ] );
    }

    uploadedFiles = {};

    var uploadedTableBodyElement = document.getElementById( "uploaded_table" ).children[ 1 ];
    while ( uploadedTableBodyElement.children.length > 0 ) {
        uploadedTableBodyElement.children[ 0 ].remove();
    }

    document.getElementById( "uploaded_section" ).style.display = "none";

    showRecentFiles( 5 );
}

/**
 * Récupère tous les fichiers présents dans la BDD et affiche les 'count' derniers documents téléchargés.
 *
 * @param {Number} count - Le nombre de documents récents qui doivent être affichés.
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function showRecentFiles ( count ) {
    if ( count < 1 ) {
        return;
    }

    var allFiles = getAllFilesFromStore();

    allFiles.onsuccess = function () {
        var tmp = this.result;
        tmp.sort( ( fileA, fileB ) => ( fileA.fileUploadDate < fileB.fileUploadDate ) ? 1 : -1 );
        fillRecentFilesTable( tmp.slice( 0, count ) );
    };
}

/**
 * Affiche les fichiers dans le tableau des documents récents.
 *
 * @param {Array} files - Le nombre de documents récents qui doivent être affichés.
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function fillRecentFilesTable ( files ) {
    var table = document.getElementById( "recent_files_table" ).getElementsByTagName( "tbody" )[ 0 ];

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

        var fileAuthor = fileRow.insertCell( -1 );
        var authorName = file.user.user_firstname + ' ' + file.user.user_lastname + ' (' + file.user.user_class + ' ' + file.user.user_promotion + ')';
        fileAuthor.innerHTML = authorName;


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

/**
 * Supprime le fichier du tableau des documents téléchargés et
 * du dictionnaire 'uploadedFiles' et
 * annule le dépôt de documents s'il reste aucun document téléchargé.
 *
 * @param {string} fileName - Le nom du fichier que l'utilisateur veut supprimer
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function deleteFileFromUploadedFiles ( fileName ) {
    delete uploadedFiles[ fileName ];
    var table = document.getElementById( "uploaded_table" ).getElementsByTagName( 'tbody' )[ 0 ];

    for ( let index = 0; index < table.children.length; index++ ) {
        if ( table.children[ index ].cells[ 0 ].innerHTML == fileName ) {
            table.children[ index ].remove();
        }
    }

    if ( table.children.length == 0 ) {
        cancelUploadedFiles();
    }
}

/**
 * Annule le dépôt de documents en cachant la section de dépôt et rechargant
 * la page pour libérer les documents téléchargés de la mémoire
 *
 * @return {undefined} - La fonction ne retourne rien
 */
function cancelUploadedFiles () {
    document.getElementById( "uploaded_section" ).style.display = "none";
    document.location.reload();
}
