import ToolSpeedrun from './speedrun'
import { Speedrun, SpeedrunSubmitState as SState, NewSpeedrun, CopySpeedrun } from '@/types/speedrun'
import { ParseSpeedrun } from '@/types/srcom'
import { Game } from '@/types/game'
import { PlusIcon, CubeIcon } from '@heroicons/react/24/outline'

import { connect, useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { addRun, deleteRun, updateRun, setSubmitState } from '@/store/speedrunsSlice'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


interface ToolSubmitProps {
	speedruns: Speedrun[];
	games: Game[];
	apikey_valid: boolean;
	user_id: string;
	className: string;
}

function ToolSubmit({ speedruns, games, apikey_valid, user_id, className }: ToolSubmitProps) {
	const dispatch = useAppDispatch()

	const game = games.find(g => g.abbr === 'swe1r')
	
	const newRun = () => {
		let r = speedruns.length === 0 ? NewSpeedrun() :
			CopySpeedrun(speedruns[speedruns.length-1],
				{ timeRT:0, timeRTNL:0, timeIGT:0, submitState:SState.Idle })
		dispatch(addRun(r))
	}

	const submitAll = () => {
		game ? speedruns.forEach(r => {
			if (r.submitState <= SState.Idle) {
				dispatch(updateRun({id:r.id, update:{
					submitJson:ParseSpeedrun(r, game, user_id)
				}}))
				dispatch(setSubmitState({id:r.id, state:SState.Queued}))
			}
		}) : null
	}

	const SubmitButtons = () => (
		<div className='flex gap-2'>
			<button onClick={newRun} title='New Run'>
				<PlusIcon className="w-8 h-8 p-1 rounded-lg bg-black/[0.25]
					stroke-zinc-500 hover:stroke-white" />
			</button>
			<button onClick={submitAll} title='Submit All'>
				<CubeIcon className="w-8 h-8 p-1 rounded-lg bg-black/[0.25]
					stroke-zinc-500 hover:stroke-sky-500" />
			</button>
		</div>
	)

	return (
		<div className={`m-8 flex flex-col gap-4 ${ className } ${ apikey_valid ? '' : 'hidden' }`}>
			<SubmitButtons />
			{ game ?
				speedruns.map(r => {
					const setRun = (changes: {}) =>
						dispatch(updateRun({id:r.id, update:changes}))
					const delRun = () =>
						dispatch(deleteRun(r.id))
					const queueRun = () => {
						dispatch(updateRun({id:r.id, update:{
							submitJson:ParseSpeedrun(r, game, user_id)
						}}))
						dispatch(setSubmitState({id:r.id, state:SState.Queued}))
					}
					return <ToolSpeedrun key={r.id} run={r} game={game}
						setRun={setRun} delRun={delRun} queueRun={queueRun} />
				})
			: null }
			<SubmitButtons />
		</div>
	)
}

function mapStateToProps(state: RootState) {
	return {
		speedruns: state.speedruns.runs,
		games: state.games.games,
		apikey_valid: state.user.apikey_validated,
		user_id: state.user.data ? state.user.data.id : '',
	}
}

export default connect(mapStateToProps)(ToolSubmit)
