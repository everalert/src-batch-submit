import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Listbox } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { UIListItem } from '@/types/ui'

interface UIListboxProps {
	label: string;
	items: UIListItem[];
	value: string;
	setValue: Dispatch<SetStateAction<string>>;
	optional: boolean;
	className: string;
	btnClass: string;
	optClass: string;
}


export default function UIListbox({
	label, items, value, setValue, optional, className, btnClass, optClass
	}: UIListboxProps) {
	const items_all: UIListItem[] = optional ?
		[{ value: '', label: '[none]', default: true }, ...items] : items

	const [selected, setSelected] = useState<UIListItem>((() => {
		let sel = items_all.find(i => i.value === value)
		if (!sel) {
			sel = items_all.find(i => i.default)
			if (!sel) sel = items_all[0]
			setValue(sel.value)
		}
		return sel
	})())
	//useEffect(() => { setValue(selected.value) }, [])

	const OnChangeFunc = (v) => {
		setValue(v.value)
		setSelected(v)
	}

	return (
		<Listbox value={selected} onChange={OnChangeFunc}
			className={`flex flex-col relative align-start ${className}`} as='div'>
			{ label ?
				<Listbox.Label className="text-xs uppercase text-zinc-400">{ label }</Listbox.Label>
			: <></> }
			<Listbox.Button className={`px-2 py-0.5 bg-black/[0.35] flex items-baseline rounded ${btnClass}`}>
				{ selected.label ? selected.label : selected.value }
				<ChevronUpDownIcon className='w-4 h-4 translate-y-0.5' />
			</Listbox.Button>
			<Listbox.Options
				className='h-24 py-1 -my-0.5 rounded bg-black
				absolute left-0 right-0 -bottom-24 z-10 overflow-auto'>
				{ items_all.map((item, i) => (
					<Listbox.Option key={i} value={item} 
						className={`pr-6 pl-2 ${optClass}`}>
						{ item.label ? item.label : item.value }
					</Listbox.Option>
				)) }
			</Listbox.Options>
		</Listbox>
	)
}
