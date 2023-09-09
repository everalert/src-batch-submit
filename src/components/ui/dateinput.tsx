import { useState } from 'react'
import { DateStrToObj, DateObjToStr } from '@/helper/formatting'


interface DateInputProps {
	label: string;
	date: Date;
	setDate: Dispatch<SetStateAction<Date>>;
	className: string;
}

function IsSameDay(date1: Date, date2: Date): boolean {
	return date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
}

export default function UIDateInput({ label, date, setDate, className }: DateInputProps) {
	const [dateStr, setDateStr] = useState<string>(IsSameDay(date, new Date()) ? '' : DateObjToStr(date))
	const [valid, setValid] = useState<boolean>(true)
	const OnChangeDate = (e) => {
		setDateStr(e.target.value)
		let d: Date = e.target.value.length > 0 ? DateStrToObj(e.target.value) : new Date()
		if (d) {
			setDate(d)
			setValid(true)
		} else {
			setValid(false)
		}
	}

	return (
		<div className="flex flex-col">
			<label className="text-xs uppercase text-zinc-400">{ label }</label>
			<input type="text" placeholder={DateObjToStr(new Date())} value={dateStr} onChange={OnChangeDate}
				className={`px-0.5 w-28 text-center rounded bg-black/[0.15] outline outline-2 ${ valid ? 'outline-black' : 'outline-red-600'}`} />
		</div>
	)
}
