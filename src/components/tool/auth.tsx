'use client'
import { useState } from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { Toggle, Input } from '@/components/ui/ui'
import { User, ParseProfileAPI } from '@/types/user'
import { ArrowTopRightOnSquareIcon, ArrowLongRightIcon } from '@heroicons/react/24/solid'
import { SRC_URL_GETAPIKEY, SRC_API_DEVPREFIX, SRC_API_PROFILE } from '@/const/srcom'

import { connect, useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { setApiKey, validateUser } from '@/store/userSlice'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

interface ToolAuthProps {
	apikey: string;
	apikey_valid: boolean;
	userdata: User;
	className: string;
}

function ToolAuth({ apikey, apikey_valid, userdata, className }: ToolAuthProps) {
	const [err, setErr] = useState<boolean>(false)
	const [errMsg, setErrMsg] = useState<string>('') 

	const dispatch = useAppDispatch()
	const storeSetApiKey = (k) => {
		dispatch(setApiKey(k))
	}

	const login = (e) => {
		const f = (async () => {
			const url = 'http://localhost:3000/'
			//const url = (process.env.NODE_DEV ? 'http://localhost:3000/' : 'http://batch.podracing.gg/')

			const opts = {
				method: 'POST',
				headers: { 'x-api-key': apikey },
				cache: 'no-store',
			}
			const userRes = await fetch(url+'api/profile', opts)
			const userData = await userRes.json()

			if (userRes.ok) {
				dispatch(validateUser(userData))
				setErr(false)
				setErrMsg('')
			} else {	
				setErr(true)
				setErrMsg(userData.message)
			}
			// FIXME: add stuff for locally saving the api key/details here
		})()
	}

	return apikey_valid ? null : (
		<div className="m-8">
			<h1 className="text-center text-4xl mb-8">No more pain</h1>
			<p className="mx-auto mb-8 w-[44rem]">Submit all your new personal bests to Speedrun.com in one fell swoop. To get started speedrunning the moderators' free time, we will need your API Key.</p>
			<div className="flex flex-col gap-2 w-[32rem] mx-auto">
				<div className="flex gap-2 items-baseline justify-center">
					<a href={SRC_URL_GETAPIKEY} target="_blank" rel="noopener noreferrer"
						className="bg-black/[0.5] text-blue-400 px-2.5 py-1.5 rounded-lg">
						Get your key <ArrowTopRightOnSquareIcon
							className="w-4 h-4 -translate-y-0.5 inline-block" />
					</a>
					<Input placeholder='and paste it here' value={apikey} setValue={storeSetApiKey}
						className="px-2 py-1 w-64" />
					<button onClick={login} className="bg-blue-500 px-2 py-1 rounded">
						Login <ArrowLongRightIcon
							className="w-4 h-4 -translate-y-0.5 inline-block" />
					</button>
				</div>
				<div className={`text-red-500 mx-8 text-sm ${ err ? '' : 'hidden' }`}>{ errMsg }</div>
			</div>
		</div>
	)
}

function mapStateToProps(state) {
	return {
		apikey: state.user.apikey,
		apikey_valid: state.user.apikey_validated,
		userdata: state.user.data,
	}
}

export default connect(mapStateToProps)(ToolAuth)
