function uploadFiles(event) {
    if (event.target.files.length == 0) {
        return;
    }
    for (let index = 0; index < event.target.files.length; index++) {
        const file = event.target.files[index];
        uploadedFiles[file.name] = {
            fileObject: file,
            fileLevel: '',
            fileSemester: '',
            fileModule: '',
            fileYear: '',
            fileName: file.name,
            fileUploadDate: Date.now()
        };
        addFileToTable(file);
    }
    document.getElementById("uploaded_section").style.display = "unset";
}

function getTableRowFromSelect(selectElement) {
    return selectElement.parentElement.parentElement;
}

function createEmptySelect(default_option) {
    var selectElement = document.createElement('select');

    var optionElement = document.createElement('option');
    optionElement.innerHTML = default_option;
    optionElement.value = '';

    selectElement.appendChild(optionElement);

    return selectElement;
}

function createFileLevelSelect() {
    var selectElement = createEmptySelect("--Choisissez le niveau d'étude--");
    selectElement.onchange = function () {
        // alert(this.parentElement.parentElement.cells[0].innerHTML);
        changeFileLevelSelect(this);
    };

    for (let index = 0; index < YEARS.length; index++) {
        const year = YEARS[index];

        var optionElement = document.createElement('option');
        optionElement.appendChild(document.createTextNode(year));
        optionElement.value = year;

        if (year != 'L2') {
            optionElement.disabled = true;
        }

        selectElement.appendChild(optionElement);
    }

    return selectElement;
}

function createFileYearSelect() {
    var selectElement = createEmptySelect("--Choisissez l'année du document--");
    selectElement.onchange = function () {
        changeFileYearSelect(this);
    };

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2000; --year) {
        var optionElement = document.createElement('option');
        optionElement.appendChild(document.createTextNode(year));
        optionElement.value = year;
        selectElement.appendChild(optionElement);
    }

    return selectElement;
}

function changeFileLevelSelect(selectElement) {
    var fileLevel = selectElement.value;

    var tableRow = getTableRowFromSelect(selectElement);
    var fileName = tableRow.cells[0].innerHTML;
    uploadedFiles[fileName].fileLevel = fileLevel;

    var semesterSelect = tableRow.cells[3].childNodes[0];
    while (semesterSelect.children[1] != null) {
        semesterSelect.children[1].remove();
    }

    if (fileLevel == '') {
        semesterSelect.options[0].innerHTML = "--Choisissez d'abord le niveau d'étude--";
    } else {
        semesterSelect.options[0].innerHTML = "--Choisissez le semestre d'étude--";
        SEMESTERS[fileLevel].forEach(semester => {
            var optionElement = document.createElement('option');
            optionElement.innerHTML = semester;
            optionElement.value = semester;
            semesterSelect.add(optionElement);
        });
    }

    changeFileSemesterSelect(semesterSelect);
}

function changeFileSemesterSelect(selectElement) {
    var fileSemester = selectElement.value;

    var tableRow = getTableRowFromSelect(selectElement);
    var fileName = tableRow.cells[0].innerHTML;
    uploadedFiles[fileName].fileSemester = fileSemester;

    var moduleSelect = tableRow.cells[4].childNodes[0];
    while (moduleSelect.children[1] != null) {
        moduleSelect.children[1].remove();
    }

    if (fileSemester == '') {
        moduleSelect.options[0].innerHTML = "--Choisissez d'abord le semestre d'étude--";
    } else {
        moduleSelect.options[0].innerHTML = "--Choisissez le module d'étude--";
        MODULES[fileSemester].forEach(semesterModules => {
            var optgroupElement = document.createElement('optgroup');
            optgroupElement.label = semesterModules[0];

            for (let index = 1; index < semesterModules.length; index++) {
                const module = semesterModules[index];

                var optionElement = document.createElement('option');
                optionElement.innerHTML = semesterModules[index];
                optionElement.value = semesterModules[index];

                optgroupElement.appendChild(optionElement);
            }

            moduleSelect.add(optgroupElement);
        });
    }

    changeFileModuleSelect(moduleSelect);
}

function changeFileModuleSelect(selectElement) {
    var fileModule = selectElement.value;

    var tableRow = getTableRowFromSelect(selectElement);
    var fileName = tableRow.cells[0].innerHTML;
    uploadedFiles[fileName].fileModule = fileModule;
}

function changeFileYearSelect(selectElement) {
    var fileYear = selectElement.value;

    var tableRow = getTableRowFromSelect(selectElement);
    var fileName = tableRow.cells[0].innerHTML;
    uploadedFiles[fileName].fileYear = fileYear;
}

function addFileToTable(file) {
    var table = document.getElementById("uploaded_table").getElementsByTagName('tbody')[0];
    var fileRow = table.insertRow(-1);

    var fileName = fileRow.insertCell(-1);
    fileName.innerHTML = file.name;

    var fileType = fileRow.insertCell(-1);
    fileType.innerHTML = FILE_TYPES[file.type];

    var fileLevel = fileRow.insertCell(-1);
    fileLevel.appendChild(createFileLevelSelect(file.name));

    var fileSemester = fileRow.insertCell(-1);
    var fileSemesterSelect = createEmptySelect("--Choisissez d'abord le niveau d'étude--");
    fileSemesterSelect.onchange = function () {
        changeFileSemesterSelect(this);
    };
    fileSemester.appendChild(fileSemesterSelect);

    var fileModule = fileRow.insertCell(-1);
    var fileModuleSelect = createEmptySelect("--Choisissez d'abord le semestre d'étude--");
    fileModuleSelect.onchange = function () {
        changeFileModuleSelect(this);
    };
    fileModule.appendChild(fileModuleSelect);

    var fileYear = fileRow.insertCell(-1);
    fileYear.appendChild(createFileYearSelect(file.name));


    var fileDelete = fileRow.insertCell(-1);
    fileDelete.style.border = "none";
    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = function () {
        deleteFileFromUploadedFiles(file.name);
    };
    var deleteButtonImg = document.createElement("img");
    deleteButtonImg.classList.add("delete-button-img");
    deleteButtonImg.src = "assets/trash-alt-solid.svg";
    deleteButton.appendChild(deleteButtonImg);
    fileDelete.appendChild(deleteButton);
}

function saveUploadedFiles() {
    for (const fileName in uploadedFiles) {
        for (const fileInfo in uploadedFiles[fileName]) {
            if (uploadedFiles[fileName][fileInfo] == '') {
                alert("Veuillez renseigner toutes les informations pour pouvoir enregistrer les documents.");
                return;
            }
        }
    }

    var user = {};
    var user_infos = ["user_firstname", "user_lastname", "user_class", "user_promotion"];
    for (let index = 0; index < user_infos.length; index++) {
        const user_info = user_infos[index];
        var element = document.getElementById(user_info);
        if (element.value.trim() == "") {
            alert("Veuillez renseigner toutes les informations pour pouvoir enregistrer les documents.");
            return;
        }
        user[user_info] = element.value.trim();
    }

    for (const fileName in uploadedFiles) {
        uploadedFiles[fileName]['user'] = user;
        addFileToStore(uploadedFiles[fileName]);
    }

    uploadedFiles = {};

    var uploadedTableBodyElement = document.getElementById("uploaded_table").children[1];
    while (uploadedTableBodyElement.children.length > 0) {
        uploadedTableBodyElement.children[0].remove();
    }

    document.getElementById("uploaded_section").style.display = "none";

    showRecentFiles(5);
}

function showRecentFiles(count) {
    if (count < 1) {
        return;
    }

    var allFiles = getAllFilesFromStore();

    allFiles.onsuccess = function () {
        var tmp = this.result;
        tmp.sort((fileA, fileB) => (fileA.fileUploadDate < fileB.fileUploadDate) ? 1 : -1);
        fillRecentFilesTable(tmp.slice(0, count));
    };
}

function fillRecentFilesTable(files) {
    var table = document.getElementById("recent_files_table").getElementsByTagName("tbody")[0];

    while (table.children.length > 0) {
        table.children[0].remove();
    }

    files.forEach(file => {
        var fileRow = table.insertRow(-1);

        var fileName = fileRow.insertCell(-1);
        fileName.innerHTML = file.fileName;

        var fileYear = fileRow.insertCell(-1);
        fileYear.innerHTML = file.fileYear;

        var fileLevel = fileRow.insertCell(-1);
        fileLevel.innerHTML = file.fileLevel;

        var fileSemester = fileRow.insertCell(-1);
        fileSemester.innerHTML = file.fileSemester;

        var fileModule = fileRow.insertCell(-1);
        fileModule.innerHTML = file.fileModule;

        var fileDownload = fileRow.insertCell(-1);
        var fileLink = document.createElement("a");
        fileLink.href = URL.createObjectURL(file.fileObject);
        fileLink.download = file.fileName;
        fileLink.innerHTML = FILE_TYPES[file.fileObject.type];
        fileDownload.appendChild(fileLink);

        var fileUploadDate = fileRow.insertCell(-1);
        var localDate = new Date(file.fileUploadDate);
        fileUploadDate.innerHTML = localDate.toLocaleString('fr-FR');

        var fileAuthor = fileRow.insertCell(-1);
        var authorName = file.user.user_firstname + ' ' + file.user.user_lastname + ' (' + file.user.user_class + ' ' + file.user.user_promotion + ')';
        fileAuthor.innerHTML = authorName;


        var fileDelete = fileRow.insertCell(-1);
        fileDelete.style.border = "none";
        var deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = function () {
            if (confirm('Êtes-vous sûr(e) de vouloir supprimer "' + file.fileName + '" ?')) {
                deleteFileFromStore(file.fileName);
                document.location.reload();
            }
        };
        var deleteButtonImg = document.createElement("img");
        deleteButtonImg.classList.add("delete-button-img");
        deleteButtonImg.src = "assets/trash-alt-solid.svg";
        deleteButton.appendChild(deleteButtonImg);
        fileDelete.appendChild(deleteButton);

    });
}

function deleteFileFromUploadedFiles(fileName) {
    delete uploadedFiles[fileName];
    var table = document.getElementById("uploaded_table").getElementsByTagName('tbody')[0];

    for (let index = 0; index < table.children.length; index++) {
        if (table.children[index].cells[0].innerHTML == fileName) {
            table.children[index].remove();
        }
    }

    if (table.children.length == 0) {
        cancelUploadedFiles();
    }
}

function cancelUploadedFiles() {
    document.getElementById("uploaded_section").style.display = "none";
    document.location.reload();
}

var uploadedFiles = {};

window.addEventListener('load', function () {
    document.getElementById("input").onchange = uploadFiles;
    showRecentFiles(5);
});