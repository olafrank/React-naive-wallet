// lib/utils.js
export function formatDate(dateString) {
    // format date nicely
    // example: from this 👉 2025-12-12 to this 👉 December 12, 2025
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}