const form = document.querySelector("#search-form")

form.addEventListener('submit', event => {
    event.preventDefault();

    const searchQuery = event.target.elements.searchQuery.value.trim();

    if (!searchQuery) {
        console.log("pust")
        return;
    }

    
})