
export function formatDate(dateString: string) {
    const parsedDate = new Date(dateString)
    return parsedDate.toLocaleString().split(",")[0]
}
