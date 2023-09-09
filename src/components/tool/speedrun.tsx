'use client'
import { Dispatch, SetStateAction } from 'react'
import { connect } from 'react-redux'
import { Speedrun, SpeedrunSubmitState as SState } from '@/types/speedrun'
import { Game, GetRTAVars, GetLevelVars, ListItemFromOpt, ListItemFromLevel, ListItemGroupFromVar } from '@/types/game'
import { User } from '@/types/user'
import { ParseSpeedrun } from '@/types/srcom'
import { Listbox, TimeInput, TimeRender, DateInput, Toggle, Swap, Input } from '@/components/ui/ui'
import { ChevronRightIcon, TrashIcon, CubeIcon } from '@heroicons/react/24/outline'


interface ToolSpeedrunProps {
	run: Speedrun;
	setRun: Dispatch<SetStateAction<Speedrun>>;
	delRun: Dispatch<SetStateAction<Speedrun>>;
	queueRun: Dispatch<SetStateAction<Speedrun>>;
	className?: string;
	game: Game;
	user: User;
}

const stateStyle = {
	[SState.Error]:		'outline outline-2 outline-red-700',
	[SState.Idle]:		'',
	[SState.Queued]:	'outline outline-2 outline-blue-900',
	[SState.Running]:	'outline outline-2 outline-blue-700',
	[SState.Success]:	'outline outline-2 outline-green-700',
}


function ToolSpeedrun({ run, setRun, delRun, queueRun, game, user, className }: ToolSpeedrunProps) {
	const isMod = game?.moderators.includes(user?.id)
	
	const variables = (run.isIL ?
		GetLevelVars(game, run.level, run.catIL) :
		GetRTAVars(game, run.catRTA))
	.map(v => ListItemGroupFromVar(v))
	.sort((a,b) => {
		const valA = a.value.toUpperCase()
		const valB = b.value.toUpperCase()
		if (valA > valB) return 1
		if (valA < valB) return -1
		return 0
	})

	const setShowSettings = (v: boolean) =>		setRun({ uiExpanded: v })
	const setIsIL = (v: boolean) =>				setRun({ isIL: v })
	const setPlayer = (v: string) =>			setRun({ modPlayer: v })
	const setGuest = (v: boolean) =>			setRun({ modGuest: v })
	const setVerify = (v: boolean) =>			setRun({ modVerify: v })
	const setTimeRT = (v: number) =>			setRun({ timeRT: v })
	//const setTimeRTNL = (v: number) =>			setRun({ timeRTNL: v })
	const setTimeIGT = (v: number) =>			setRun({ timeIGT: v })
	const setDate = (v: Date) =>				setRun({ date: v.toString() })
	const setCatRTA = (v: string) =>			setRun({ catRTA: v })
	const setCatIL = (v: string) =>				setRun({ catIL: v })
	const setLevel = (v: string) =>				setRun({ level: v })
	const setPlatSys = (v: string) =>			setRun({ platSys: v })
	const setPlatReg = (v: string) =>			setRun({ platReg: v })
	const setPlatEmu = (v: boolean) =>			setRun({ platEmu: v })
	const setVideo = (v: string) =>				setRun({ urlVideo: v })
	const setSplitsIO = (v: string) =>			setRun({ urlSplitsIO: v })
	const setComment = (v: string) =>			setRun({ comment: v })
	const setVar = (k: string, v: string) =>	setRun({ variables: {...run.variables, [k]:v} })

	return ( <div className={`flex flex-col gap-0.5 w-[48rem]
 rounded-lg bg-zinc-800 ${ stateStyle[run.submitState] }
${ run.uiExpanded ? '' : 'h-[4.25rem]'} ${ className }`}>

	 	{/* Title bar */}
		<div className="p-2 px-2 col-span-2 bg-zinc-800 select-none rounded-lg
			grid grid-cols-[min-content_1fr_min-content] gap-x-4 items-baseline">
			<Swap labelOff='RTA' labelOn='IL' enabled={run.isIL} setEnabled={setIsIL} />
			{ run.isIL ? 
				<div><b>{run.level} ({run.catIL})</b> in <TimeRender time={run.timeIGT} /></div>
				: <div><b>{run.catRTA}</b> in <TimeRender time={run.timeRT} /></div>
			}
			{ run.uiExpanded ? '' : <div className="flex gap-2 col-start-2">
				{ Object.keys(run.variables).map(k => 
					<div key={k} className="px-2 bg-slate-800 rounded
						outline outline-1 outline-slate-900">
						{run.variables[k]}
				</div>)}
			</div> }
			<div className="col-start-3 row-start-1 flex gap-2">
				<button
					title='log run object'
					onClick={()=>console.log(run)}>
					<CubeIcon className="w-5 h-5 translate-y-1
						stroke-zinc-500 hover:stroke-lime-400" />
				</button>
				<button 
					title='Queue Run'
					onClick={queueRun}>
					<CubeIcon className="w-5 h-5 translate-y-1
						stroke-zinc-500 hover:stroke-sky-500" />
				</button>
				<button onClick={delRun}>
					<TrashIcon className="w-5 h-5 translate-y-1
						stroke-zinc-500 hover:stroke-red-500" />
				</button>
				<button onClick={()=>setShowSettings(!run.uiExpanded)}>
					<ChevronRightIcon
						className={`w-5 h-5 translate-y-1 transition duration-75
						stroke-zinc-500 hover:stroke-zinc-200
						${ run.uiExpanded ? 'rotate-90' : ''}`} />
				</button>
			</div>
		</div>

		{/* Submission settings */}
		<div className={`grid grid-cols-[4fr_3fr] gap-4 mx-1 py-3 px-4 rounded-lg bg-zinc-900
			${ run.uiExpanded ? '' : 'hidden' }`}>
			{/* Category settings, variables, time */}
			<div className="row-span-2 flex flex-col items-start gap-2"> 
				<div className="flex gap-4">
					{ !run.isIL ?
						<TimeInput label='Realtime' time={run.timeRT} setTime={setTimeRT} /> : '' }
					{/* <TimeInput label='Realtime No Loads' time={run.timeRTNL} setTime={setTimeRTNL} /> */}
					<TimeInput label='In-Game Time' time={run.timeIGT} setTime={setTimeIGT} />
				</div>

				{ run.isIL ?
					<div className="flex gap-2">
						<Listbox label='Level' items={game.il_levels.map(l=>ListItemFromLevel(l))}
							className='w-64' value={run.level} setValue={setLevel} />
						<Listbox label='Category' items={game.il_categories.map(o=>ListItemFromOpt(o))}
							className='w-20' value={run.catIL} setValue={setCatIL} />
					</div>
					: <Listbox label='Category' items={game.rta_categories.map(o=>ListItemFromOpt(o))}
						className='w-72' value={run.catRTA} setValue={setCatRTA} />
				}

				{ variables.map(v => ( 
					<Listbox key={v.key} label={v.value} items={v.items} optional={v.optional}
						className='w-48' value={run.variables[v.value]} setValue={(val)=>setVar(v.value, val)} />
				)) }
			</div>

			{/* non-essential; run details */}
			<div className="flex flex-col items-start gap-2"> 
				<DateInput label='Date' date={new Date(run.date)}  setDate={setDate} />
				<div className="flex flex-col">
					<div className="text-xs uppercase text-zinc-400">Platform</div>
					<div className="flex items-baseline gap-1">
						<Listbox items={game.plat_systems.map(o=>ListItemFromOpt(o))} btnClass="w-16"
							value={run.platSys} setValue={setPlatSys} />
						{ run.platSys === 'PC' ? '' : <>
							<Listbox items={game.plat_regions.map(o=>ListItemFromOpt(o))}
								value={run.platReg} setValue={setPlatReg} optional={true} />
							<Toggle label='EMU' enabled={run.platEmu} setEnabled={setPlatEmu} />
						</> }
					</div>
				</div>
				<Input label='Video' value={run.urlVideo} setValue={setVideo} />
				{ run.isIL ? <></> :
					<Input label='Splits.io' value={run.urlSplitsIO} setValue={setSplitsIO} /> }
			</div>

			{/* Descripion/Comment */}
			<div className="flex flex-col">
				<div className="text-xs uppercase text-zinc-400">Comment</div>
				<textarea value={run.comment} onChange={(e)=>setComment(e.target.value)}
					className="rounded h-24 px-1 outline outline-2 outline-black bg-black/[0.15] text-white" />
			</div>

			{/* Error display */}
			{ run.submitState === SState.Error ? 
				<div className='col-span-2 mx-2 my-1 text-red-500 text-sm'>
					<div className='font-bold mb-0.5'>Submission Errors</div>
					<ul className='list-disc ml-4'>
					{ run.submitErrMsg.map(m => 
						<li>{m}</li>
					) }
					</ul>
				</div>
			: <></> }
		</div>
		

		{/* Moderator-only options */}
		{ isMod ? <div className={`px-1 pt-0.5 pb-1 col-span-2 flex items-baseline justify-end gap-1 text-zinc-400 bg-zinc-800 text-right rounded-lg ${ run.uiExpanded ? '' : 'hidden' }`}> 
			<div>submit for <input type="text" placeholder={user.name}
				value={run.modPlayer} onChange={(e)=>setPlayer(e.target.value)}
				className="rounded px-1 mx-1 w-32 outline outline-2 outline-black bg-black/[0.15]" />
			</div>
			<Toggle label='Guest' enabled={run.modGuest} setEnabled={setGuest} />
			<Toggle label='Verify' enabled={run.modVerify} setEnabled={setVerify} />
			</div> : <></> }
	</div> )
}

function mapStateToProps(state) {
	return {
		user: state.user.data,
	}
}

export default connect(mapStateToProps)(ToolSpeedrun)
