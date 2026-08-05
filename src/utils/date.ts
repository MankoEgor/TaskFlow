export function formatDateTime(value: string): string {
    const date = new Date(value);

    if(Number.isNaN(date.getTime)){
        return 'Uncknow date';
    }

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short'
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);

    return `${formattedDate}, ${formattedTime}`
}