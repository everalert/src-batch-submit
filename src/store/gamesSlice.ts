import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Game } from '@/types/game'

export interface GameUpdate {
	game: number;
	update: Object;
}

export interface GamesState {
	games: Game[];
}

const initialState: GamesState = {
	games: []
}

const gamesSlice = createSlice({
	name: "games",
	initialState,
	reducers: {
		addGame: (state, action: PayloadAction<Game>) => {
			state.games = [...state.games, action.payload]
		},
		deleteGame: (state, action: PayloadAction<number>) => {
			state.games = state.games.filter((g,i) => i !== action.payload)
		},
		updateGame: (state, action: PayloadAction<GameUpdate>) => {
			state.games[action.payload.game] =
				{ ...state.games[action.payload.game], ...action.payload.update }
		},
	},
})

export const { addGame, deleteGame, updateGame } = gamesSlice.actions
export default gamesSlice.reducer
