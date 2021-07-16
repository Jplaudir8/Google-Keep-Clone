class App {
    constructor() {
        this.$form = document.querySelector('#form'); // Selecting form tag
        this.$noteTitle = document.querySelector('#note-title'); // selecting input tag
        this.$formButtons = document.querySelector('#form-buttons'); // selecting div
        
        this.addEventListeners();
    }

    addEventListeners() {
        document.body.addEventListener('click', event => {
            this.handleFormClick(event);
        });
    }

    handleFormClick(event) {
        const isFormClicked = this.$form.contains(event.target); //event.target gives us the clicked element.
        if (isFormClicked) {
            this.openForm();
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
    }
}

new App()