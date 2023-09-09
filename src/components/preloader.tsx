'use client'
import { useRef, useEffect } from 'react'
import { store } from '@/store'
import { addGame } from '@/store/gamesSlice'
import { SRC_API_GAMEDATA } from '@/const/srcom'
import { Game, ParseGameAPI } from '@/types/game'

import { connect, useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { RootState, AppDispatch } from '@/store'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default function Preloader() {
	const dispatch = useAppDispatch()
	const loaded = useRef(false)
	
	useEffect(() => {
		if (!loaded.current) {
			const f = (async () => {
				const gameReq = await fetch(SRC_API_GAMEDATA)
				const gameData = await gameReq.json()
				const game: Game = ParseGameAPI(gameData)
				dispatch(addGame(game))
				loaded.current = true
			})()
		}
	})

	return null
}
