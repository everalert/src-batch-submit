import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types/user'

export interface UserState {
	apikey: string;
	apikey_validated: boolean;
	data: User | null;
}

const initialState: UserState = {
	apikey: '',
	apikey_validated: false,
	data: null,
}

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setApiKey: (state, action: PayloadAction<string>) => {
			state.apikey = action.payload
			state.apikey_validated = false
		},
		validateUser: (state, action: PayloadAction<User>) => {
			state.data = action.payload
			state.apikey_validated = true
		},
		logoutUser: (state) => {
			state.data = null
			state.apikey = ''
			state.apikey_validated = false
		},
	},
})

export const { setApiKey, validateUser, logoutUser } = userSlice.actions
export default userSlice.reducer
