function Day({ day, selectedDay, dayPast, setSelectedDate }: { day: number, selectedDay: number, dayPast: boolean, setSelectedDate: (day: number) => void }) {
    if (dayPast) {
        return (
            <div className="w-12 h-12 flex justify-center items-center rounded text-slate-200">{day}</div>
        );
    }

    if (day === selectedDay) {
        return (
            <div className="w-12 h-12 flex justify-center items-center rounded bg-slate-200">{day}</div>
        );
    }

    return (
        <div className="w-12 h-12 flex justify-center items-center rounded hover:bg-slate-200" onClick={() => setSelectedDate(day)}>{day}</div>
    );
}

export default Day
