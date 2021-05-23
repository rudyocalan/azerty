const YEARS = ['L1', 'L2', 'L3', 'M1', 'M2'];
const SEMESTERS = {
    'L2': ['S3', 'S4']
};
const MODULES = {
    'S3': [
        [
            'INFORMATIQUE GÉNÉRALE',
            'Fondamentaux de l\'algorithmique 3',
            'Introduction au génie logiciel'
        ],
        [
            'MATHÉMATIQUES',
            'Fonctions de plusieurs variables',
            'Probabilités'
        ],
        [
            'PHYSIQUE ET ÉLECTRONIQUE',
            'Champs électromagnétiques',
            'Physique moderne',
            'Systèmes de transmission'
        ]
    ],
    'S4': [
        [
            'INFORMATIQUE GÉNÉRALE',
            'Mathématiques pour l\'informatique',
            'Programmation Orientée Objets avec le language Java',
            'Programmation WEB'
        ],
        [
            'MATHÉMATIQUES',
            'Analyse de données',
            'Modélisation mathématiques'
        ],
        [
            'PHYSIQUE ET ÉLECTRONIQUE',
            'Propagation électromagnétique',
            'Systèmes numériques',
            'Thermodynamique'
        ]
    ]
};
var uploadedFiles = {};

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
            fileYear: ''
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
    fileType.innerHTML = file.type;

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
}

window.addEventListener('load', function () {
    document.getElementById("input").onchange = uploadFiles;
});