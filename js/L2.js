const CURRENT_LEVEL = "L2";

function showFilesList() {
    var divElement = document.getElementById("files_list");

    var ul1Element = document.createElement("ul");
    ul1Element.classList.add('ul1');

    SEMESTERS[CURRENT_LEVEL].forEach(semester => {
        var li1Element = document.createElement("li");

        var listText = document.createElement("a");
        listText.href = '';
        listText.innerHTML = semester;

        li1Element.appendChild(listText);

        var ul2Element = document.createElement("ul");
        ul2Element.classList.add('ul2');


        MODULES[semester].forEach(ue => {
            var li2Element = document.createElement("li");

            var listText = document.createElement("a");
            listText.href = '';
            listText.innerHTML = ue[0];

            li2Element.appendChild(listText);

            var ul3Element = document.createElement("ul");
            ul3Element.classList.add('ul3');


            for (let index = 1; index < ue.length; index++) {
                const module = ue[index];

                var li3Element = document.createElement("li");

                var listText = document.createElement("a");
                listText.href = '';
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


window.addEventListener('load', function () {
    showFilesList();
});