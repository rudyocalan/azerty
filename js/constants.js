const STUDY_LEVELS = [ 'L1', 'L2', 'L3', 'M1', 'M2' ];

const SEMESTERS = {
    'L2': [ 'S3', 'S4' ]
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

const FILE_TYPES = {
    "text/plain": "TXT",
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "application/pdf": "PDF",
    "application/vnd.ms-powerpoint": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 'DOCX',
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "application/zip": "ZIP"
};