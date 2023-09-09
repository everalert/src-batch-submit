import { MsToDurationStr } from '@/helper/formatting'

export default function UITimeRender({ time }) {
	return <span className="font-semibold">{ MsToDurationStr(time) }</span>
}
