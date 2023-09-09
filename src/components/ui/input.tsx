import { useState, Dispatch, SetStateAction } from 'react'

interface InputProps {
	label: string;
	value: string;
	placeholder: string;
	setValue: Dispatch<SetStateAction<Speedrun>>;
	className: string;
}


export default function UIInput({ label, value, placeholder, setValue, className }: InputProps) {
	return (
		<div className={`flex flex-col`}>
			{ label ? <label className="text-xs uppercase text-zinc-400">{label}</label> : '' }
			<input type="text" value={value} onChange={(e)=>setValue(e.target.value)}
				className={`px-0.5 rounded outline outline-2 outline-black bg-black/[0.15] ${className}`}
				placeholder={ placeholder ? placeholder : label } />
		</div>
	)
}
