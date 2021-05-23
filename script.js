let years = ['L1', 'L2', 'L3', 'M1', 'M2'];
let semesters = {
    'L2': ['S3', 'S4']
};
let UEs = [
    'INFORMATIQUE GÉNÉRALE',
    'MATHÉMATIQUES',
    'PHYSIQUE ET ÉLECTRONIQUE'
];
let modules = {
    'S3': {
        'INFORMATIQUE GÉNÉRALE': [
            'Fondamentaux de l\'algorithmique 3',
            'Introduction au génie logiciel'
        ],
        'MATHÉMATIQUES': [
            'Fonctions de plusieurs variables',
            'Probabilités'
        ],
        'PHYSIQUE ET ÉLECTRONIQUE': [
            'Champs électromagnétiques',
            'Physique moderne',
            'Systèmes de transmission'
        ]
    },
    'S4': {
        'INFORMATIQUE GÉNÉRALE': [
            'Mathématiques pour l\'informatique',
            'Programmation Orientée Objets avec le language Java',
            'Programmation WEB'
        ],
        'MATHÉMATIQUES': [
            'Fonctions de plusieurs variables',
            'Probabilités'
        ],
        'PHYSIQUE ET ÉLECTRONIQUE': [
            'Champs électromagnétiques',
            'Physique moderne',
            'Systèmes de transmission'
        ]
    }
};

var uploadedFiles = {};

function uploadFiles(event) {
    if (event.target.files.length == 0) {
        return;
    }

    for (let index = 0; index < event.target.files.length; index++) {
        const file = event.target.files[index];
        uploadedFiles[file.name] = {
            fileObject: file
        };
        addFileToTable(file);
    }

    document.getElementById("uploaded_section").style.display = "unset";
}

function addFileToTable(file) {
    var table = document.getElementById("uploaded_table").getElementsByTagName('tbody')[0];
    var fileRow = table.insertRow(-1);

    var fileName = fileRow.insertCell(-1);
    fileName.innerHTML = file.name;

    var fileType = fileRow.insertCell(-1);
    fileType.innerHTML = file.type;

    var fileYear = fileRow.insertCell(-1);
    fileYear.innerHTML = loadHTML('dropdown-file-year.html');
}

window.addEventListener('load', function () {
    document.getElementById("input").onchange = uploadFiles;
});