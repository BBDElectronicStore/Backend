export class TimeEvents {
    newMonth: boolean;
    newYear: boolean;
    date: string;

    constructor(newMonth: boolean, newYear: boolean, date: string) {
        this.newMonth = newMonth;
        this.newYear = newYear;
        this.date = date;
    }
}

export class Simulation {
    private simStart: Date;
    private currentDate: string;
    private isRunning: boolean;

    constructor(simStart: string) {
        this.simStart = simStart ? new Date(simStart) : new Date();
        this.currentDate = "01|01|01";
        this.isRunning = false;
    }

    public updateDate(): TimeEvents {
        const newDate = this.calculateTime();
        const events = this.compareDates(this.currentDate, newDate);
        this.currentDate = newDate;
        return new TimeEvents(events.newMonth, events.newYear, newDate);
    }

    private calculateTime(): string {
        const timePassed = new Date().getTime() - this.simStart.getTime();
        const simDaysPassed = Math.round(timePassed / (1000 * 60)) / 2;

        const years = Math.floor(simDaysPassed / (12 * 30));
        const months = Math.floor((simDaysPassed % (12 * 30)) / 30);
        const days = (simDaysPassed % (12 * 30)) % 30;

        // Format the date as YY|MM|DD
        const formattedDate = `${(years + 1).toString().padStart(2, '0')}|${(months + 1).toString().padStart(2, '0')}|${(days + 1).toString().padStart(2, '0')}`;
        return formattedDate;
    }

    public compareDates(oldDate: string, newDate: string): TimeEvents {
        const oldParts = oldDate.split('|');
        const newParts = newDate.split('|');

        const oldYear = parseInt(oldParts[0]);
        const oldMonth = parseInt(oldParts[1]);
        const newYear = parseInt(newParts[0]);
        const newMonth = parseInt(newParts[1]);

        const isNewMonth = newMonth !== oldMonth;
        const isNewYear = newYear !== oldYear;

        return new TimeEvents(isNewMonth, isNewYear, "");
    }

    public reset(): void {
        this.isRunning = false;
    }

    public startSim(): void {
        this.isRunning = true;
        this.currentDate = "01|01|01";
        this.simStart = new Date();
    }

    public daysSinceDate(date: string): number {
        return Simulation.convertToDays(this.currentDate) - Simulation.convertToDays(date);
    }

    private static convertToDays(date: string): number {
        const dateParts = date.split('|');
        const years = parseInt(dateParts[0]);
        const months = parseInt(dateParts[1]);
        const days = parseInt(dateParts[2]);

        return (years * 12 + months) * 30 + days;
    }
}
