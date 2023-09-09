import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Speedrun, SpeedrunSubmitState as SState } from '@/types/speedrun'

export interface SpeedrunUpdate {
	id: string;
	update: Object;
}

export interface SpeedrunSetSubmit {
	id: string;
	state: SState;
}
export interface SpeedrunSetSubmitError {
	id: string;
	messages: string[];
}

export interface SpeedrunsState {
	runs: Speedrun[];
}

const initialState: SpeedrunsState = {
	runs: []
}

const speedrunsSlice = createSlice({
	name: "speedruns",
	initialState,
	reducers: {
		addRun: (state, action: PayloadAction<Speedrun>) => {
			const newRun: Speedrun = {...action.payload, id: Date.now().toString()}
			while (state.runs.find(r => r.id === newRun.id))
				newRun.id = `${newRun.id}_`
			state.runs = [...state.runs, newRun]
		},
		deleteRun: (state, action: PayloadAction<string>) => {
			state.runs = state.runs.filter(r => r.id !== action.payload)
		},
		updateRun: (state, action: PayloadAction<SpeedrunUpdate>) => {
			const i = state.runs.findIndex(r => r.id === action.payload.id)
			if (i >= 0 && state.runs[i].submitState <= SState.Idle)
				state.runs[i] = { ...state.runs[i], ...action.payload.update }
		},
		setSubmitState: (state, action: PayloadAction<SpeedrunSetSubmit>) => {
			const i = state.runs.findIndex(r => r.id === action.payload.id)
			const newState = action.payload.state
			if (i >= 0) {
				state.runs[i] = {
					...state.runs[i],
					submitState: newState,
					uiExpanded: newState===SState.Queued ? false : state.runs[i].uiExpanded,
				}
			}
		},
		setSubmitError: (state, action: PayloadAction<SpeedrunSetSubmitError>) => {
			const i = state.runs.findIndex(r => r.id === action.payload.id)
			if (i >= 0) { 
				state.runs[i] = { 
					...state.runs[i],
					submitState: SState.Error,
					submitErrMsg: action.payload.messages,
					uiExpanded: true,
				}
			}
		},
	},
})

export const {
	addRun, deleteRun, updateRun, setSubmitState, setSubmitError
} = speedrunsSlice.actions
export default speedrunsSlice.reducer
