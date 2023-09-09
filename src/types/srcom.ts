import { Speedrun } from './speedrun'
import { Game, GetRTAVars, GetAllLevelVars } from './game' 
import { DateObjToStr } from '@/helper/formatting'


// see:
// https://github.com/speedruncomorg/api/blob/master/version1/json-schema/run-submit.json
// https://github.com/speedruncomorg/api/blob/master/version1/json-schema/definitions.json

export type SRCSubmission = {
	// only 'category', 'platform' and 'times' are required
	category: string;		// ref
	level?: string;			// ref
	date?: string;			// YYYY-MM-DD
	region?: string;		// ref
	platform: string;		// ref
	verified?: boolean;		// default false
	times: SRCTimes;
	players?: (SRCPlayerUser|SRCPlayerGuest)[]; // min. 1 item if included
	emulated?: boolean;		// default false
	video?: string;
	comment?: string;
	splitsio?:  string;
	variables?: { [key: string]: SRCVariable; };	// keys are refs
}

export type SRCTimes = {	// only one required, times in seconds
	realtime?: number;
	realtime_noloads?: number;
	ingame?: number;
}

enum SRCPlayerRel {
	User = 'user',
	Guest = 'guest',
}
export type SRCPlayerUser = {
	rel: SRCPlayerRel.User;
	id: string;		// NOTE: cannot use normal username, must be id
}
export type SRCPlayerGuest = {
	rel: SRCPlayerRel.Guest;
	name: string;	// minlength 1
}

enum SRCVariableType {
	PreDef = 'pre-defined',
	UserDef = 'user-defined',
}
export type SRCVariable = {
	type: SRCVariableType;
	value: string;
}


export function IsRefValid(ref: string) {
// regex /^[a-z0-9]+$/; maxlength 50
}
export function IsVideoValid(ref: string) {
// maxlength 255
}
export function IsCommentValid(ref: string) {
// maxlength 2000
}
export function IsSplitsIoValid(ref: string) {
// maxlength 50
}


export function ParseSpeedrun(run: Speedrun, game: Game, userid: string): SRCSubmission {
	let submission: SRCSubmission = {}
	// only 'category', 'platform' and 'times' are required; more depends on game/cat settings
	let vars
	if (run.isIL) {
		submission.category = game.il_categories.find(c => c.value === run.catIL).id
		submission.level = game.il_levels.find(l => l.value === run.level).id
		vars = GetAllLevelVars(game)
	} else {
		submission.category = game.rta_categories.find(c => c.value === run.catRTA).id
		vars = GetRTAVars(game, run.catRTA)
	}
	if (vars.length) {
		const variables: SRCSubmission['variables'] = {}
		vars.forEach(v => {
			// FIXME: use var context data to decide how to fill value
			// instead of this convoluted bs
			// also, the pre-defined val has to be valid even if it's irrel to the category LOL
			variables[v.id] = v.userDef ?
				{
					type: 'user-defined',
					value: run.variables[v.name] ? run.variables[v.name] : '',
				} as SRCVariable : {
					type: 'pre-defined',
					value: v.options?.find(o => o.value === run.variables[v.name]) ? v.options.find(o => o.value === run.variables[v.name])?.id : v.options[0].id,
				} as SRCVariable
		})
		submission.variables = variables
	}

	submission.times = {} as SRCTimes;
	if (run.timeRT > 0)		submission.times.realtime			= run.timeRT/1000
	if (run.timeRTNL > 0)	submission.times.realtime_noloads	= run.timeRTNL/1000
	if (run.timeIGT > 0) 	submission.times.ingame				= run.timeIGT/1000

	submission.date = DateObjToStr(new Date(run.date))
	if (run.comment.length)		submission.comment				= run.comment
	if (run.urlVideo.length)	submission.video				= run.urlVideo
	if (run.urlSplitsIO.length)	submission.splitsio				= run.urlSplitsIO

	submission.platform		= game.plat_systems.find(s => s.value === run.platSys).id
	const regionId = game.plat_regions.find(r => r.value === run.platReg)?.id
	if (regionId)			submission.region					= regionId 
	if (run.platEmu)		submission.emulated					= run.platEmu

	if (game.moderators.includes(userid)) {
		if (run.modVerify)		submission.verified				= run.modVerify
		if (run.modPlayer.length > 0) {
			let player = run.modGuest ?
				{ rel:'guest', name:run.modPlayer } as SRCPlayerGuest :
				{ rel:'user', id:run.modPlayer } as SRCPlayerUser
			submission.players = [ player ]
		}
	}
	
	return submission
}
