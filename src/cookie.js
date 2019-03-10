/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

let filterValue = '';

function isMatching(full, chunk) {
    return !chunk || (full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1);
}

function getCookie() {
    if (!document.cookie) {
        return {};
    }

    const cookies = document.cookie.split('; ').reduce((prev, current) => {
        const [name, value] = current.split('=');

        prev[name] = value;

        return prev;
    }, {});

    return cookies;
}

function getRow(name, value) {
    let row = document.createElement('tr');
    let deleteBtn = document.createElement('td');

    deleteBtn.innerHTML = '<button>Удалить</button>';
    row.appendChild(deleteBtn);
    row.insertAdjacentHTML('afterBegin', `<td data-content="${name}">${name}</td><td>${value}</td>`);

    return row;
}

function fillTable(obj, chunk) {
    let fragment = document.createDocumentFragment();

    listTable.innerHTML = '';

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (isMatching(key, chunk) || isMatching(obj[key], chunk)) {
                fragment.appendChild(getRow(key, obj[key]));
            } 
        }
    }

    listTable.appendChild(fragment);
}

function removeCookie(name) {
    const date = new Date(0);

    document.cookie = `${name}=; expires=${date.toUTCString()}`;
}

fillTable(getCookie(), filterValue);

listTable.addEventListener('click', e => {
    if (e.target.nodeName === 'BUTTON') {
        const currentRow = e.target.parentElement.parentElement;
        const currentName = currentRow.firstElementChild.innerText;

        removeCookie(currentName);
        currentRow.remove();
    }
})

filterNameInput.addEventListener('keyup', function() {
    filterValue = filterNameInput.value;
    fillTable(getCookie(), filterValue);
});

addButton.addEventListener('click', () => {
    let cookies = getCookie();
    let name = addNameInput.value;
    let value = addValueInput.value;

    if (cookies.hasOwnProperty(name)) {
        removeCookie(name);
    }
    document.cookie = `${name}=${value}`;
    fillTable(getCookie(), filterValue);

    setTimeout(() => {
        addNameInput.value ='';
        addValueInput.value ='';
    }, 100);
});
