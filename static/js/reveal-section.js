document.querySelectorAll(".grid-board-item h4").forEach(heading => {
    heading.addEventListener("click", () => {
        const parentItem = heading.closest(".grid-board-item");
        parentItem.classList.toggle("active");
    });
});
