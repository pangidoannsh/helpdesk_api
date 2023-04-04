export function displayDate(dateArgument?: Date): { date: string, time: string } {
    function getBulan(bulan: any) {
        let namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return namaBulan[bulan];
    }

    try {
        const strCreatedAt = new Date(dateArgument).toLocaleString();
        const arrTime = strCreatedAt.split(', ');
        const dateRaw = arrTime[0];
        const dateObj = new Date(dateRaw);
        const date = dateObj.getDate() + " " + getBulan(dateObj.getMonth()) + " " + dateObj.getFullYear();
        const time = arrTime[1].slice(0, 5);

        return { date, time };
    } catch (e) {
        return { date: '', time: '' };
    }
}

export function displayDateFromArrayObject(data: Array<any>, key: string) {
    const result = data.map((data: any) => {
        const dateKey = data[key];

        if (dateKey) {
            const { date, time } = displayDate(dateKey);
            return { ...data, [key]: date + ' ' + time }
        }
        return data
    })
    return result;
}

export function getExpiredDate(longDays: number) {
    const date = new Date();
    date.setDate(date.getDate() + longDays);
    return date;
}