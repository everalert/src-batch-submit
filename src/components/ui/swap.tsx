import { Dispatch, SetStateAction } from 'react'
import { Switch } from '@headlessui/react'

interface UISwapProps {
	labelOn: string;
	labelOff: string;
	enabled?: boolean;
	setEnabled: Dispatch<SetStateAction<boolean>>;
}

export default function UISwap({ labelOn, labelOff, enabled, setEnabled }: UISwapProps) {
	return (
		<Switch checked={enabled} onChange={setEnabled}>
			<span className="bg-black/[0.35] pl-0.5 pr-2 py-0.5 relative inline-flex items-center rounded-md transition duration-75">
				<span className={`${ enabled ? 'translate-x-1.5 bg-indigo-800 text-indigo-200' : 'bg-teal-800 text-teal-200' } px-2 w-12 py-0 inline-block transform rounded transition duration-75`}
				>{ enabled ? labelOn : labelOff }</span>
			</span>
		</Switch>
	)
}
