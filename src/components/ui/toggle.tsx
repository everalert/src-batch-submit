import { Dispatch, SetStateAction } from 'react'
import { Switch } from '@headlessui/react'

interface UIToggleProps {
	label: string;
	enabled: boolean;
	setEnabled: Dispatch<SetStateAction<boolean>>;
}

export default function UIToggle({ label, enabled, setEnabled }: UIToggleProps) {
	return (
		<Switch 
			checked={enabled}
			onChange={setEnabled}
			>
			<span className="bg-black/[0.35] pl-0.5 pr-2 py-0.5 relative inline-flex items-center rounded-md transition duration-75">
				<span className={`${ enabled ? 'translate-x-1.5 bg-blue-800 text-blue-200' : 'bg-blue-400 text-blue-300' } px-2 py-0 inline-block transform rounded transition duration-75`}
				>{ label }</span>
			</span>
		</Switch>
	)
}
