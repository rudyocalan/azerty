const CURRENT_LEVEL = "L2";

function showModuleList() {
    var divElement = document.getElementById("module_list");

    var ul1Element = document.createElement("ul");
    ul1Element.classList.add('ul1');

    SEMESTERS[CURRENT_LEVEL].forEach(semester => {
        var li1Element = document.createElement("li");

        var semesterTest = document.createElement('span');
        semesterTest.innerHTML = semester;
        semesterTest.classList.add("semester_name");
        li1Element.appendChild(semesterTest);

        var ul2Element = document.createElement("ul");
        ul2Element.classList.add('ul2');

        MODULES[semester].forEach(ue => {
            var li2Element = document.createElement("li");

            var ueText = document.createElement('span');
            ueText.innerHTML = ue[0];
            ueText.classList.add("ue_name");
            li2Element.appendChild(ueText);

            var ul3Element = document.createElement("ul");
            ul3Element.classList.add('ul3');


            for (let index = 1; index < ue.length; index++) {
                const module = ue[index];

                var li3Element = document.createElement("li");

                var listText = document.createElement("a");
                listText.href = '#';
                listText.onclick = function () {
                    var previousSelectedModule = document.getElementById("selected_module");
                    if (previousSelectedModule) {
                        previousSelectedModule.id = "";
                    }
                    this.id = "selected_module";
                    showModuleFiles(module);
                };
                listText.innerHTML = module;

                li3Element.appendChild(listText);
                ul3Element.appendChild(li3Element);
            }

            li2Element.appendChild(ul3Element);
            ul2Element.appendChild(li2Element);
        });

        li1Element.appendChild(ul2Element);
        ul1Element.appendChild(li1Element);
    });

    divElement.appendChild(ul1Element);

}

function clearFilesList() {
    var tbody = document.getElementById("file_list_table").getElementsByTagName("tbody")[0];
    while (tbody.children.length > 0) {
        tbody.children[0].remove();
    }
}


function showFiles(files) {
    var table = document.getElementById("file_list_table").getElementsByTagName("tbody")[0];

    files.forEach(file => {
        var fileRow = table.insertRow(-1);

        var fileName = fileRow.insertCell(-1);
        fileName.innerHTML = file.fileName;

        var fileYear = fileRow.insertCell(-1);
        fileYear.innerHTML = file.fileYear;

        // var filePreview = fileRow.insertCell(-1);

        var fileDownload = fileRow.insertCell(-1);
        var fileLink = document.createElement("a");
        fileLink.href = URL.createObjectURL(file.fileObject);
        fileLink.download = file.fileName;
        fileLink.innerHTML = FILE_TYPES[file.fileObject.type];
        fileDownload.appendChild(fileLink);


        var fileUploadDate = fileRow.insertCell(-1);
        var localDate = new Date(file.fileUploadDate);
        fileUploadDate.innerHTML = localDate.toLocaleString('fr-FR');

    });
}

function showModuleFiles(module) {
    clearFilesList();

    var allFiles = getAllFilesFromStore();

    allFiles.onsuccess = function () {
        var moduleFiles = [];
        this.result.forEach(file => {
            if (file.fileModule == module) {
                moduleFiles.push(file);
            }
        });
        showFiles(moduleFiles);
    };

    document.getElementById("file_list").style.display = "unset";

}

window.addEventListener('load', function () {
    showModuleList();
    // showModuleFiles("Fondamentaux de l'algorithmique 3");
});