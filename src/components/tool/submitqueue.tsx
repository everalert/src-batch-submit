'use client'
import { useEffect } from 'react'
import { Speedrun, SpeedrunSubmitState as SState } from '@/types/speedrun'

import { connect, useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { setSubmitState, setSubmitError } from '@/store/speedrunsSlice'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


interface SubmitQueueProps {
	speedrun?: Speedrun;
	running: number;
	apikey_valid: boolean;
	apikey: string;
}

const MAX_CONCURRENT = 5


function ToolSubmitQueue({ speedrun, running, apikey_valid, apikey }: SubmitQueueProps) {
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!speedrun || !apikey_valid || running>=MAX_CONCURRENT) return

		dispatch(setSubmitState({ id:speedrun.id, state:SState.Running }))
		const f = async () => {
			const url = 'http://localhost:3000/'	// FIXME: use env later i guess
			const opts: RequestInit = {
				method: 'POST',
				headers: { 'x-api-key': apikey },
				body: JSON.stringify(speedrun.submitJson),	// setup in ToolSubmit/ToolSpeedrun
				cache: 'no-store',
			}
			const submit_res = await fetch(url+'api/submit', opts)
			const submit_data = await submit_res.json()

			if (submit_res.ok)
				dispatch(setSubmitState({ id:speedrun.id, state:SState.Success }))
			else
				dispatch(setSubmitError({ id:speedrun.id, messages:submit_data.errors }))
		}
		f()
	}, [speedrun, running])

	return null
}

function mapStateToProps(state: RootState) {
	return {
		speedrun: state.speedruns.runs.find(r => r.submitState === SState.Queued),
		running: state.speedruns.runs.filter(r => r.submitState === SState.Running).length,
		apikey: state.user.apikey,
		apikey_valid: state.user.apikey_validated,
	}
}

export default connect(mapStateToProps)(ToolSubmitQueue)
