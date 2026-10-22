export function getCurrentDate(): string {
    const currentDate = new Date();
    const year: string = currentDate.getFullYear().toString();
    const month: string = (currentDate.getMonth() + 1).toString();
    const day: string = currentDate.getDate().toString();

    return `${day}/${month}/${year}`;
}
