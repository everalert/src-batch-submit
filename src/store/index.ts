import { configureStore } from '@reduxjs/toolkit'
import speedrunsReducer from './speedrunsSlice'
import gamesReducer from './gamesSlice'
import userReducer from './userSlice'

export const store = configureStore({
	reducer: {
		speedruns: speedrunsReducer,
		games: gamesReducer,
		user: userReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
