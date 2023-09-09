import { NextRequest, NextResponse } from 'next/server'
import { SRC_API_DEVPREFIX, SRC_API_PROFILE, SRC_API_GAMEDATA } from '@/const/srcom'
import { User, ParseProfileAPI } from '@/types/user'

const url = SRC_API_PROFILE
//const url = (process.env.NODE_DEV ? SRC_API_DEVPREFIX : '') + SRC_API_PROFILE

export async function POST(req: NextRequest) {
	if (!req.headers.has('x-api-key'))
		return NextResponse.json({ message: 'Header X-API-Key missing.' },{ status: 400 })
	
	const apikey = req.headers.get('x-api-key')
	const result = await (async () => {
		const opts = {
			method: 'GET',
			headers: { 'X-API-Key': apikey },
			cache: 'no-store',
		}
		const userRes = await fetch(url, opts)
		const userData = await userRes.json()
		
		if (!userRes.ok)
			return NextResponse.json({
				message: 'SRC API Error ('+userData.status+'): '+userData.message,
				status: userData.status,
			}, { status: userData.status })
		
		return NextResponse.json(ParseProfileAPI(userData))
	})()

	return result
}
