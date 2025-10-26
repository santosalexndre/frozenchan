const pad = (n: number) => n.toString().padStart(2, '0');

export function formatDate(date: Date): string {
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dayName = weekdays[date.getDay()];

    return `${day}-${month}-${year} (${dayName}) ${hours}:${minutes}:${seconds}`;
}
