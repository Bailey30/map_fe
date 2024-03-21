export function extractFormData(formData: FormData): { [key: string]: string } {
    // The Object.fromEntries() static method transforms a list of key-value pairs into an object.
    const form = Object.fromEntries(formData)
    const data = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, value as string])
    )
    return data
}
