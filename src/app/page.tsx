'use client'
// could probably use server components at least for the SRC API stuff,
// but simpler and maybe better to just let the client bear the load
// due to rate limiting

import Preloader from '@/components/preloader'
import ToolAuth from '@/components/tool/auth.tsx'
import ToolSubmit from '@/components/tool/submit.tsx'
import ToolSubmitQueue from '@/components/tool/submitqueue.tsx'

export default function Home() {
	return (
		<main>
			<Preloader />
			<ToolAuth />
			<ToolSubmit /> 
			<ToolSubmitQueue /> 
		</main>
	)
}
