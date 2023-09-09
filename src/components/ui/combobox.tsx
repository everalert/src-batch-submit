import { useState, Dispatch, SetStateAction } from 'react'
import { Combobox } from '@headlessui/react'

interface UIComboboxProps {
	items: object[];
	selectedItem: object;
	setSelectedItem: Dispatch<SetStateAction<object>>;
	inputClass: string;
	optClass: string;
}

export default function UICombobox({ items, inputClass, optClass }: UIComboboxProps) {
	const [selectedItem, setSelectedItem] = useState(items[0])
	const [query, setQuery] = useState('')

	const filteredItems =
		query === '' ? items : items.filter((item) => {
				return item.name.toLowerCase().includes(query.toLowerCase())
			})

	return (
		<Combobox value={selectedItem} onChange={setSelectedItem}>
			<Combobox.Input 
				className={`px-2 py-0.25 bg-zinc-900 text-white outline outline-2 outline-black rounded ${ inputClass }`}
				onChange={(event) => setQuery(event.target.value)}
			/>
			<Combobox.Options>
				{filteredItems.map((item, i) => (
					<Combobox.Option key={i} value={item.name} className={ optClass }>
						{item.name}
					</Combobox.Option>
				))}
			</Combobox.Options>
		</Combobox>
	)
}
