class App {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || []; // JSON.parse lets us convert it back to an array. Its the opposite to using stringify.
        this.title = '';
        this.text = '';
        this.id = '';

        this.$placeholder = document.querySelector('#placeholder'); // selecting div
        this.$form = document.querySelector('#form'); // Selecting form tag
        this.$notes = document.querySelector('#notes'); // Selecting div
        this.$noteTitle = document.querySelector('#note-title'); // selecting input tag
        this.$noteText = document.querySelector('#note-text'); // selecting input tag
        this.$formButtons = document.querySelector('#form-buttons'); // selecting div
        this.$formCloseButton = document.querySelector('#form-close-button'); // selecting button
        this.$modal = document.querySelector('.modal'); // selecting div
        this.$modalTitle = document.querySelector(".modal-title"); // selecting input tag
        this.$modalText = document.querySelector(".modal-text"); // selecting input tag
        this.$modalCloseButton = document.querySelector(".modal-close-button"); // selecting span
        this.$colorTooltip = document.querySelector("#color-tooltip"); // selecting img

        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        document.body.addEventListener('click', event => {
            this.handleFormClick(event);
            this.selectNote(event);
            this.openModal(event);
            this.deleteNote(event);
        });

        document.body.addEventListener('mouseover', event => {
            this.openTooltip(event);
        });

        document.body.addEventListener('mouseout', event => {
            this.closeTooltip(event);
        });

        this.$colorTooltip.addEventListener('mouseover', function() { // had to change the callback function to a function declaration to use the 'this' keyword which in this case refers to our own object ($colorTooltip)
            this.style.display = 'flex';
        });
 
        this.$colorTooltip.addEventListener('mouseout', function() { // had to change the callback function to a function declaration to use the 'this' keyword which in this case refers to our own object ($colorTooltip)
            this.style.display = 'none';
        });

        this.$colorTooltip.addEventListener('click', event => {
            const color = event.target.dataset.color;
            if (color) {
                this.editNoteColor(color);
            }
        })

        this.$form.addEventListener('submit', event => {
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            const hasNote = title || text;
            if(hasNote) {
                this.addNote({ title, text }); // instead of sending them as parameters, we're sending them as an object.
            }
        });

        this.$formCloseButton.addEventListener('click', event => {
            event.stopPropagation(); // this helps us not propagating the click that would also be read by document.body.addEvenetListener()
            this.closeForm();
        });

        this.$modalCloseButton.addEventListener('click', event => {
            this.closeModal(event);
        });
    }

    handleFormClick(event) {
        const isFormClicked = this.$form.contains(event.target); //event.target gives us the clicked element.
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const hasNote = title || text;
        if (isFormClicked) {
            this.openForm();
        } else if (hasNote) {
            this.addNote({title, text});
        } else {
            this.closeForm();
        }
    }

    openForm() {
        this.$form.classList.add('form-open');
        this.$noteTitle.style.display = 'block';
        this.$formButtons.style.display = 'block';
    }

    closeForm() {
        this.$form.classList.remove('form-open');
        this.$noteTitle.style.display = 'none';
        this.$formButtons.style.display = 'none';
        this.$noteTitle.value = '';
        this.$noteText.value = '';
    }

    // If a note was clicked then global variables were first populated(with selectNode()). Display note as modal.
    openModal(event) {
        if (event.target.matches('.toolbar-delete')) return;

        if (event.target.closest('.note')) { // target.closest() lets us see if we clicked closest to the element with class 'note' which in fact means if we clicked on the note.
            this.$modal.classList.toggle('open-modal');
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }

    closeModal(event) {
        this.editNote();
        this.$modal.classList.toggle('open-modal');
    }

    openTooltip(event) {
        if (!event.target.matches('.toolbar-color')) return; // checking if event.target is the toolbar color
        this.id = event.target.dataset.id;
        const noteCoords = event.target.getBoundingClientRect(); // this gives specific coordinates of where we are hovering over.
        const horizontal = noteCoords.left + window.scrollX;
        const vertical = window.scrollY - 25;
        this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
        this.$colorTooltip.style.display = 'flex';
    }

    closeTooltip(event) {
        if (!event.target.matches('.toolbar-color')) return;
        this.$colorTooltip.style.display = 'none';
    }

    addNote(note) {
        const newNote = {
            title: note.title,
            text: note.text,
            color: 'white',
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        }
        this.notes = [...this.notes, newNote];
        this.render();
        this.closeForm();
    }

    editNote() {
        const title = this.$modalTitle.value;
        const text = this.$modalText.value;
        this.notes = this.notes.map(note => // .map() returns a new array so we simply reassign it in its own after performing the mutation.
            note.id === Number(this.id) ? { ...note, title, text } : note // updating properties of the selected note
        );
        this.render();
    }

    editNoteColor(color) {
        this.notes = this.notes.map(note => 
            note.id === Number(this.id) ? { ...note, color } : note
        );
        this.render();
    }

    // populate variables if note has been clicked... openModal() continues with more.
    selectNote(event) {
        const $selectedNote = event.target.closest('.note');
        if (!$selectedNote) return; // stop here if no note was clicked.
        const [$noteTitle, $noteText] = $selectedNote.children // gives us an array of the elements that are inside this html div.
        this.title = $noteTitle.innerText;
        this.text = $noteText.innerText;
        this.id = $selectedNote.dataset.id; // There will be a property called id which is the same name as we put after the dash in our html down below. (data-id)
    }

    deleteNote(event) {
        event.stopPropagation(); // to avoid having the note being opened by calling the openModal function
        if (!event.target.matches('.toolbar-delete')) return;
        const id = event.target.dataset.id;
        this.notes = this.notes.filter(note => note.id !== Number(id));
        this.render();
    }

    render() {
        this.saveNotes();
        this.displayNotes();
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes)); // we create a key value pair for localStorage. Remember we use stringify because to store a value in local storage it has to be in string datatype.
    }

    displayNotes() {
        const hasNotes = this.notes.length > 0;
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex';
        this.$notes.innerHTML = this.notes.map(note => `
            <div style="background: ${note.color};" class="note" data-id="${note.id}"> <!-- The 'data-' property is a way of storing data in html -->
                <div class="${note.title && 'note-title'}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <div class="toolbar">
                        <img class="toolbar-color" data-id="${note.id}" src="https://lh3.googleusercontent.com/proxy/T735jw1mDEmlTdgwgik2I28cSKhZWjaYXqrf3wt2jGBDxpApJWQsecXgdKG9EhZrGsqyDWOQVaYi_YYSvmCk2C6JdaN5k5GYnqF46zWgJDRQKcyK0B8udLuazcNlcCgx">
                        <img class="toolbar-delete" data-id="${note.id}" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSovwlVVOj3uhOzAOD12w2wKxp6_CHZaDLt5A&usqp=CAU">
                    </div>
                </div>
            </div>
        `).join("");
    }

}

new App();