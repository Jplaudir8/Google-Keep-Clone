class App {
    constructor() {
        this.notes = [];

        this.$placeholder = document.querySelector('#placeholder'); // selecting div
        this.$form = document.querySelector('#form'); // Selecting form tag
        this.$notes = document.querySelector('#notes'); // Selecting div
        this.$noteTitle = document.querySelector('#note-title'); // selecting input tag
        this.$noteText = document.querySelector('#note-text'); // selecting input tag
        this.$formButtons = document.querySelector('#form-buttons'); // selecting div
        this.$formCloseButton = document.querySelector('#form-close-button');

        this.addEventListeners();
    }

    addEventListeners() {
        document.body.addEventListener('click', event => {
            this.handleFormClick(event);
        });

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

    addNote(note) {
        const newNote = {
            title: note.title,
            text: note.text,
            color: 'white',
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        }
        this.notes = [...this.notes, newNote];
        this.displayNotes();
        this.closeForm();
    }

    displayNotes() {
        const hasNotes = this.notes.length > 0;
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex';
        this.$notes.innerHTML = this.notes.map(note => `
            <div style="background: ${note.color};" class="note">
                <div class="${note.title && 'note-title'}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <div class="toolbar">
                        <img src="toolbar-color" src="https://icon.now.sh/palette">
                        <img src="toolbar-delete" src="https://icon.now.sh/delete">
                    </div>
                </div>
            </div>
        `).join("");
    }
}

new App();