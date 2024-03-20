
export function formatBase64String(string: string): string {
    console.log(decodeURIComponent("data:image/jpeg;base64, " + string))
    return decodeURIComponent("data:image/jpeg;base64, " + string)
}

export function formatMoney(amount: number) {
    // Check if the amount has a decimal point
    if (amount % 1 === 0) {
        // If there is no decimal point, return the amount without decimals
        return amount.toFixed(0);
    } else {
        // If there is a decimal point, return the amount with 2 decimal places
        return amount.toFixed(2);
    }
}
