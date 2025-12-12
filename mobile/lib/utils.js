// lib/utils.js
export function formatDate(dateString) {
    // format date nicely
    // example: from this 👉 2025-12-12 to this 👉 December 12, 2025
    if (!dateString || typeof dateString !== 'string') {
        throw new Error('Invalid date string provided');
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}