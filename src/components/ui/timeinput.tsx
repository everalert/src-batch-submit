import { useState } from 'react'
import { MsToDurationStr, DurationStrToMs } from '@/helper/formatting'


interface TimeInputProps {
	label: string;
	time: number;
	setTime: Dispatch<SetStateAction<number>>;
	className: string;
}

export default function UITimeInput({ label, time, setTime, className }: TimeInputProps) {
	const [timeStr, setTimeStr] = useState<string>(time > 0 ? MsToDurationStr(time) : '')
	const [valid, setValid] = useState<boolean>(false)
	const OnChangeTime = (e) => {
		setTimeStr(e.target.value)
		let s = DurationStrToMs(e.target.value)
		if (s) {
			setTime(s)
			setValid(true)
		} else {
			setValid(false)
		}
	}
	return (
		<div className={`flex flex-col ${className}`}>
			<label className="text-xs uppercase text-zinc-400">{ label }</label>
			<input type="text" placeholder="0:00:00.000" value={timeStr} onChange={OnChangeTime}
				className={`px-0.5 w-28 text-center rounded bg-black/[0.15] outline outline-2 ${ valid ? 'outline-black' : 'outline-red-600'}`} />
		</div>
	)
}
