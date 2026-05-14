export function sortCollection(collections, sortBy, sortDirection) {
    if (!sortBy)
        return collections;

    return [...collections].sort((a, b) => {
        const aValue = a[sortBy]
        const bValue = b[sortBy]

        if (typeof aValue === "number" && typeof bValue === "number") 
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

        return sortDirection === "asc" ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue))
    })
}