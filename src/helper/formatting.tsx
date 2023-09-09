import { RE_DURATION, RE_DATE } from '@/const/formatting'

export function MsToDurationStr(time: number): string {
	let ms : number = (time%1000)
	let s : number = Math.floor(time/1000)%60
	let m : number = Math.floor(time/1000/60)%60
	let h : number = Math.floor(time/1000/3600)
	return `${ h ? `${h}:${("00"+m).slice(-2)}` : m }:${("00"+s).slice(-2)}.${("000"+ms).slice(-3)}`
}

export function DurationStrToMs(duration: string): number | null {
	let match = duration.split(RE_DURATION)
	if (match === null) return null
	
	let ms : number = match[8] ? parseInt((match[8]+"000").slice(0,3)) : 0
	let s : number = match[6] ? parseInt(match[6])*1000 : 0
	let m : number = match[5] ? parseInt(match[5])*1000*60 : 0
	let h : number = match[3] ? parseInt(match[3])*1000*3600 : 0
	return h + m + s + ms
}

export function DateObjToStr(date: Date): string {
	return `${date.getFullYear()}-${("00"+(date.getMonth()+1)).slice(-2)}-${("00"+date.getDate()).slice(-2)}`
}

export function DateStrToObj(date: string): Date | null {
	let match = date.split(RE_DATE)
	if (match === null) return null

	let yyyy: number = parseInt(match[1])
	let mm: number = parseInt(match[2])-1
	let dd: number = parseInt(match[3])
	let d: Date = new Date(yyyy,mm,dd)
	if (isNaN(d) || d > (new Date()) || mm<0 || mm>11 || dd<1 || dd>31)
		return null
	return d
}
