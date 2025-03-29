

// to YYYY-MM-DD format or YYYY-DD-MM depending on locale
export function isoDateToDisplay(isoDate: string): string {
    // Parse the ISO date string
    const date = new Date(isoDate);

    // Format the date to YYYY-MM-DD
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat(navigator.language, options).format(date);

    // Return formatted date
    return formattedDate;
}