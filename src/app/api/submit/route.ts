import { NextRequest, NextResponse } from 'next/server'
import { SRC_API_RUNS } from '@/const/srcom'

const url = SRC_API_RUNS

export async function POST(req: NextRequest) {
	if (!req.headers.has('x-api-key'))
	return NextResponse.json({ message: 'Header X-API-Key missing.' }, { status:400 })

	const data = await req.json()
	const apikey = req.headers.get('x-api-key')
	const result = await (async () => {
		const opts: RequestInit = {
			method: 'POST',
			headers: { 'X-API-Key': apikey } as HeadersInit,
			body: JSON.stringify({'run':data}),
			cache: 'no-store',
		}
		const submit_res: Response = await fetch(url, opts)
		return submit_res
	})()

	return result
}
