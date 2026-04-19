// List :
// Pengkondisian jika ada isi class content maka class blank hilang ✅
// Date and Day ✅
// Dark mode (baru tombol belum style)
// Notebooks and Notes CRUD ✅

// ============ //
// Dom Elements //
// ============ //

const blank = document.getElementById('blank');
const content = document.getElementById('content');
const notebookDasboardTitle = document.getElementById('notebook-dashboard-title');
const dateContent = document.getElementById('date');
const darkInput = document.getElementById('dark-mode');
const darkIcon = document.getElementById('dark-icon');
const notebookList = document.getElementById('notebooks-list');
const addNotebookBtn = document.getElementById('add-notebook-form');
const noteFull = document.getElementById('note');
const addNoteForm = document.getElementById('add-note-form');
const blankForm = document.getElementById('form');
const darkLayer = document.querySelector('.dark-layer');
const blurLayer = document.querySelector('.blur-layer');
const logo = document.getElementById('Logo');
const mobileNavBtn = document.getElementById('mobile-menu');
const sideNav = document.getElementById('side-nav');
const closeSideNav = document.getElementById('close-side-nav');
const mobileAddNote = document.getElementById('mobile-add-note')

// ============ //
//    Script    //
// ============ //

const now = new Date();
const Year = now.getFullYear();
const Month = now.getMonth();
const Day = now.getDay() - 1;
const date = now.getDate();
const nameDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const nameMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dateFormat = `${nameDay[Day < 0 ? 6 : Day]}, ${nameMonth[Month]} ${date} ${Year}`;
dateContent.textContent = dateFormat;

function checkBlank() {
    if (content.childElementCount > 0) {
        blank.style.display = 'none';
    } else {
        blank.style.display = 'flex';
    }
}

darkInput.addEventListener('click', () => {
    const isDark = darkInput.checked;
    if (isDark) {
        document.documentElement.classList.add('dark');
        darkIcon.classList.replace('ri-sun-line', 'ri-moon-fill');
        logo.src = 'assets/svg/LogoDark.svg';
    } else {
        document.documentElement.classList.remove('dark');
        darkIcon.classList.replace('ri-moon-fill', 'ri-sun-line');
        logo.src = 'assets/svg/LogoLight.svg';
    }

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    darkInput.checked = true;
    darkIcon.classList.replace('ri-sun-line', 'ri-moon-fill');
    logo.src = 'assets/svg/LogoDark.svg';
} else {
    document.documentElement.classList.remove('dark');
    darkInput.checked = false;
    darkIcon.classList.replace('ri-moon-fill', 'ri-sun-line');
    logo.src = 'assets/svg/LogoLight.svg';
}

// ==================== //
// Notebook & Note CRUD //
// ==================== //

function getAllNotebooks() {
    const rawData = localStorage.getItem('Notebooks');
    return rawData ? JSON.parse(rawData) : [];
}

function renderNotebooks(isAddingNotebook = false, editingId = null) {
    const Notebooks = getAllNotebooks();
    notebookList.innerHTML = '';
    
    // Ambil ID aktif untuk menentukan style kartu
    const currentActiveId = notebookDasboardTitle.dataset.currentId;

    if(isAddingNotebook) {
        const draft = document.createElement('div');
        draft.className = 'notebook-card draft';
        draft.innerHTML = `<input type="text" id="draft-input" value="Notebook" placeholder="Notebook name..." autofocus>`;
        notebookList.appendChild(draft);

        const inputDraft = document.getElementById('draft-input');
        inputDraft.focus();
        inputDraft.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.value.trim() !== '' ) {
                addNotebook(e.target.value);
            } else if (e.key === 'Escape') {
                renderNotebooks();
            }
        });
    }

    Notebooks.forEach((notebook) => {
        const card = document.createElement('div');
        card.className = `notebook-card ${notebook.id == currentActiveId ? 'selected' : ''}`;
        card.dataset.id = notebook.id;

        if(notebook.id == editingId) {
            card.innerHTML = `<input type="text" id="edit-input" value="${notebook.title}" placeholder="Notebook name..." autofocus>`;
            notebookList.appendChild(card);
            const inputEdit = document.getElementById('edit-input');
            inputEdit.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.value.trim() !== '' ) {
                    updateNotebookTitle(notebook.id, e.target.value);
                } else if (e.key === 'Escape') {
                    renderNotebooks();
                }
            });
        } else {
            card.innerHTML = `
                <p>${notebook.title}</p>
                <div class="buttons">
                    <button title="Edit Notebook" onClick="prepareEdit(${notebook.id})" id='edit-btn'><span class="material-symbols-outlined">edit</span></button>
                    <button title="Delete Notebook" id='delete-btn'><span class="material-symbols-outlined">delete</span></button>
                </div>
            `;
            notebookList.appendChild(card);
        }
    });
}

function addNotebook(title) {
    const Notebooks = getAllNotebooks();
    const newNotebook = { id: Date.now(), title: title, notes: [] };
    Notebooks.push(newNotebook);
    localStorage.setItem('Notebooks', JSON.stringify(Notebooks));
    renderNotebooks();
}

function notebookCardClick(id) {
    const Notebooks = getAllNotebooks();
    const selectedNotebook = Notebooks.find(notebook => notebook.id == id);
    if (selectedNotebook) {
        notebookDasboardTitle.innerHTML = selectedNotebook.title;
        notebookDasboardTitle.dataset.currentId = id;
        renderNotes(selectedNotebook.notes, id);
        
        // Render ulang agar class active berpindah
        renderNotebooks();
    }
}

function renderNotes(notes, notebookId) {
    content.innerHTML = '';
    notes.forEach((note) => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
                <h3 id="note-title">${note.title}</h3>
                <p id="note-content">${note.content}</p>
                <div class="note-footer">
                    <button title="Delete Note" class="delete-note-card"><span class="material-symbols-outlined">delete</span></button>
                </div>
        `;
        noteCard.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-note-card')) {
                openNote(note.title, note.content, false, note.id);
            } else {
                showCustomConfirm(`Are you sure want to delete "${note.title}"?`, () => {
                    deleteNote(notebookId, note.id);
                });
            }
        });
        content.appendChild(noteCard);
    });
    checkBlank();
}

function renderNoteEditor(title, content, isAdding, isEditing) {
    if (isEditing || isAdding) {
        noteFull.innerHTML = `
            <div class="title">
                <input type="text" id="edit-note-title" class="edit-note-title" placeholder="Note Title..." value="${title}">
                ${!isAdding ? `<button id="close-note" class="close-note"><span class="material-symbols-outlined">close</span></button>` : ''}
            </div>
            <textarea id="edit-note-content" class="edit-note-content" placeholder="Write your thoughts here...">${content}</textarea>
            <div class="buttons-note">
                ${!isAdding ? `<button id="cancel-note" class="cancel-note">Cancel</button>` : ''}
                <button id="save-note-btn" class="save-note" disabled>Save</button>
            </div>
        `;
    } else {
        noteFull.innerHTML = `
            <div class="title">
                <h3>${title}</h3>
                <button id="close-note" class="close-note"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div class="note-body-view"><p>${content}</p></div>
            <div class="buttons-note">
                <button id="edit-note" class="edit-note">Edit</button>
            </div>
        `;
    }
}

// FUNGSI CUSTOM DIALOG (Untuk Alert dan Confirm)
function showCustomConfirm(message, onConfirm = null, isAlertOnly = false) {
    blurLayer.classList.add('show');
    blankForm.classList.add('show');
    
    if (isAlertOnly) {
        blankForm.innerHTML = `
            <p>${message}</p>
            <div class="form-buttons">
                <button class="submit-btn ok-btn">OK</button>
            </div>
        `;
        blankForm.querySelector('.ok-btn').onclick = cancelForm;
    } else {
        blankForm.innerHTML = `
            <p>${message}</p>
            <div class="form-buttons">
                <button class="cancel-btn">Cancel</button>
                <button class="submit-btn delete-confirm">Confirm</button>
            </div>
        `;
        blankForm.querySelector('.cancel-btn').onclick = cancelForm;
        blankForm.querySelector('.delete-confirm').onclick = () => {
            if (onConfirm) onConfirm();
            cancelForm();
        };
    }
}

function openNote(title = "", contentText = "", isAdding = false, noteId = null, isEditing = false) {
    noteFull.classList.add('show');
    darkLayer.classList.add('show');

    const originalTitle = title;
    const originalContent = contentText;

    renderNoteEditor(title, contentText, isAdding, isEditing);

    if (!isAdding && !isEditing) {
        document.getElementById('edit-note').onclick = () => {
            openNote(title, contentText, false, noteId, true);
        };
        document.getElementById('close-note').onclick = closeNoteFull;
        return;
    }

    const titleInput = document.getElementById('edit-note-title');
    const contentInput = document.getElementById('edit-note-content');
    const saveBtn = document.getElementById('save-note-btn');

    const updateSaveButtonStyle = () => {
        const isChanged = titleInput.value !== originalTitle || contentInput.value !== originalContent;
        const isEmpty = titleInput.value.trim() === "";
        if (isChanged && !isEmpty) {
            saveBtn.classList.add('change'); 
            saveBtn.disabled = false;
        } else {
            saveBtn.classList.remove('change'); 
            saveBtn.disabled = isEmpty; 
        }
    };

    titleInput.addEventListener('input', updateSaveButtonStyle);
    contentInput.addEventListener('input', updateSaveButtonStyle);

    const handleExit = () => {
        const isChanged = titleInput.value !== originalTitle || contentInput.value !== originalContent;
        if (isChanged) {
            showCustomConfirm("Discard unsaved changes?", () => {
                closeNoteFull();
            });
        } else {
            closeNoteFull();
        }
    };

    if (isAdding) {
        saveBtn.onclick = () => {
            addNote(notebookDasboardTitle.dataset.currentId, titleInput.value, contentInput.value);
            closeNoteFull();
        };
    } else {
        saveBtn.onclick = () => {
            updateNote(notebookDasboardTitle.dataset.currentId, noteId, titleInput.value, contentInput.value);
            closeNoteFull();
        };
        document.getElementById('close-note').onclick = handleExit;
        document.getElementById('cancel-note').onclick = handleExit;
    }
}

function closeNoteFull() {
    noteFull.classList.remove('show');
    darkLayer.classList.remove('show');
}

function addNote(notebookId, title, content) {
    const Notebooks = getAllNotebooks();
    const notebook = Notebooks.find(nb => nb.id == notebookId);
    if (notebook) {
        notebook.notes.push({ id: Date.now(), title: title, content: content });
        localStorage.setItem('Notebooks', JSON.stringify(Notebooks));
        renderNotes(notebook.notes, notebookId);
    }
}

function updateNote(notebookId, noteId, newTitle, newContent) {
    const Notebooks = getAllNotebooks();
    const notebook = Notebooks.find(nb => nb.id == notebookId);
    if (notebook) {
        const note = notebook.notes.find(n => n.id == noteId);
        if (note) {
            note.title = newTitle;
            note.content = newContent;
            localStorage.setItem('Notebooks', JSON.stringify(Notebooks));
            renderNotes(notebook.notes, notebookId);
        }
    }
}

function deleteNote(notebookId, noteId) {
    const Notebooks = getAllNotebooks();
    const notebook = Notebooks.find(nb => nb.id == notebookId);
    if (notebook) {
        notebook.notes = notebook.notes.filter(n => n.id !== noteId);
        localStorage.setItem('Notebooks', JSON.stringify(Notebooks));
        renderNotes(notebook.notes, notebookId);
    }
}

function cancelForm() {
    blankForm.classList.remove('show');
    blurLayer.classList.remove('show');
    if (!noteFull.classList.contains('show')) {
        darkLayer.classList.remove('show');
    }
    blankForm.innerHTML = '';
}

function deleteNotebookForm(id) {
    const Notebooks = getAllNotebooks();
    const afterDelete = Notebooks.filter(notebook => notebook.id !== Number(id));
    localStorage.setItem('Notebooks', JSON.stringify(afterDelete));

    if (notebookDasboardTitle.dataset.currentId == id) {
        notebookDasboardTitle.innerHTML = 'No Notebook Selected';
        notebookDasboardTitle.dataset.currentId = '';
        content.innerHTML = '';
        checkBlank();
    }
    renderNotebooks();
    cancelForm();
}

function prepareEdit(id) {
    renderNotebooks(false, id);
}

function updateNotebookTitle(id, newTitle){
    const Notebooks = getAllNotebooks();
    const editNotebook = Notebooks.find((notebook) => notebook.id == id);
    if (editNotebook) {
        editNotebook.title = newTitle;
        localStorage.setItem('Notebooks', JSON.stringify(Notebooks));
        if (notebookDasboardTitle.dataset.currentId == id) {
            notebookDasboardTitle.innerHTML = newTitle;
        }
    }
    renderNotebooks();
}

// Listeners
addNoteForm.addEventListener('click', () => {addNoteClick()});
mobileAddNote.addEventListener('click', () => {addNoteClick()});
function addNoteClick() {
    const currentId = notebookDasboardTitle.dataset.currentId;
    if (currentId) {
        openNote("Untitled", "Write your thought here...", true);
    } else {
        // Ganti alert browser dengan custom alert
        showCustomConfirm("Please select a notebook first!", null, true);
    }
};

addNotebookBtn.addEventListener('click', () => {
    renderNotebooks(true);
});

notebookList.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('#delete-btn');
    const editBtn = e.target.closest('#edit-btn');
    const card = e.target.closest('.notebook-card');

    if (deleteBtn) {
        const notebookCard = deleteBtn.closest('.notebook-card');
        const notebookId = notebookCard.dataset.id;
        const notebookTitle = notebookCard.querySelector('p').textContent;

        showCustomConfirm(`Are you sure want to delete "${notebookTitle}"?`, () => {
            deleteNotebookForm(notebookId);
        });
    } 
    else if (editBtn) {
        const notebookId = editBtn.closest('.notebook-card').dataset.id;
        prepareEdit(notebookId);
    } 
    else if (card && !card.classList.contains('draft') && !card.querySelector('input')) {
        notebookCardClick(card.dataset.id);
    }
});

renderNotebooks();

// Mobile
mobileNavBtn.addEventListener('click', () => {
    sideNav.classList.toggle('open');
})

closeSideNav.addEventListener('click', () => {
    sideNav.classList.toggle('open');
})