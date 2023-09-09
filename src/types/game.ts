import { UIListItem, UIListItemGroup } from '@/types/ui'

export type Game = {
	id: string;		// m1mmex12
	abbr: string;	// swe1r
	name: string;	// Star Wars Episode I: Racer
	rule_showMs: boolean;
	rule_reqVerify: boolean;
	rule_reqVideo: boolean;
	rule_times: string[];
	rule_timeDflt: string;
	rule_allowEmu: boolean;
	moderators: string[]; // ids
	//assets: {}; //maybe
	plat_systems: GameOption[];
	plat_regions: GameOption[];
	rta_variables: GameVariable[];
	rta_categories: GameOption[];
	il_variables: GameVariable[];
	il_categories: GameOption[];
	il_levels: GameLevel[];
	originaldata: {};
}

export type GameVariable = {
	id: string;
	name: string;
	mandatory: boolean;
	userDef: boolean;
	categoryID: string | null;
	levelID: string | null;
	options: GameOption[];
}

export type GameOption = {
	id: string;
	value: string;
	label?: string;
	default?: boolean;
}

export type GameLevel = {
	id: string;
	value: string;
}

export function ParseGameAPI(apidata: any): Game {
	const data = apidata.data
	const game: Game = {}
	game.originaldata	= data
	game.id				= data.id
	game.abbr			= data.abbreviation
	game.name			= data.names.international
	game.rule_showMs	= data.ruleset['show-milliseconds']
	game.rule_reqVerify	= data.ruleset['require-verification']
	game.rule_reqVideo	= data.ruleset['require-video']
	game.rule_times		= data.ruleset['run-times']
	game.rule_timeDflt	= data.ruleset['default-time']
	game.rule_allowEmu	= data.ruleset['emulators-allowed']
	game.moderators		= Object.keys(data.moderators)
	// game.assets: {}

	if (data.platforms) {
		game.plat_systems =
			data.platforms.data.map((p: any) => { return {
				id:			p.id,
				value:		p.name,
				//label?:	???
				default:	p.name === 'PC',
		}})
	}

	if (data.regions) {
		game.plat_regions =
			data.regions.data.map((r: any) => { return {
				id:			r.id,
				value:		r.name,
				//label?:	???
		}})
	}

	if (data.levels) {
		game.il_levels =
			data.levels.data.map((l: any) => { return {
				id:		l.id,
				value:	l.name,
		}})
	}

	if (data.categories) {
		const rta: GameOption[] = [];
		const il: GameOption[] = [];
		data.categories.data.forEach((c: any) => {
			const cat: GameOption = {
				id: c.id,
				value: c.name,
			}
			if (c.type === 'per-game')
				rta.push(cat)
			else
				il.push(cat)
		})
		game.rta_categories = rta
		game.il_categories = il
	}

	if (data.variables) {
		const rta: GameVariable[] = [];
		const il: GameVariable[] = [];
		data.variables.data.forEach((v: any) => {
			const variable: GameVariable = {
				id:			v.id,
				name:		v.name,
				mandatory:	v.mandatory,
				categoryID:	v.category,
				levelID:	null,
				userDef:	v['user-defined'],
				options:	Object.keys(v.values.values).map(k => { return {
					id:			k,
					value:		v.values.values[k].label,
					default:	v.values.default === k,
				}})
			}

			if (v.scope.type === 'global' || v.scope.type === 'full-game')
				rta.push(variable)
			if (v.scope.type === 'global' || v.scope.type === 'all-levels')
				il.push(variable)
			if (v.scope.type === 'single-level') {
				variable.levelID = v.scope.level
				il.push(variable)
			}
		})
		game.rta_variables = rta
		game.il_variables = il
	}

	return game
}

export function GetRTAVars(game: Game, category: string): GameVariable[] {
	let categoryID = game.rta_categories.find(c => c.value === category)?.id
	return [
		...game.rta_variables
	].filter(v => v.categoryID === categoryID || !v.categoryID)
}

export function GetAllLevelVars(game: Game): GameVariable[] {
	return game.il_variables
}

// FIXME: add data about what the var is for back into the object
export function GetLevelVars(game: Game, level: string, category: string): GameVariable[] {
	let categoryID = game.il_categories.find(c => c.value === category)?.id
	let levelID = game.il_levels.find(l => l.value === level)?.id
	return game.il_variables.filter(v =>
		(v.levelID===levelID || !v.levelID) && ((v.categoryID===categoryID) || !v.categoryID))
}

export function ListItemFromOpt(option: GameOption): UIListItem {
	return {
		value:		option.value,
		label:		option.label,
		default:	option.default,
	}
}

export function ListItemFromLevel(level: GameLevel): UIListItem {
	return {
		value:		level.value,
		//label:		level.label,
	}
}

export function ListItemGroupFromVar(variable: GameVariable): UIListItemGroup {
	return {
		key:		variable.id,
		value:		variable.name,
		optional:	!variable.mandatory,
		items:		variable.options.map(o => ListItemFromOpt(o)),
	}
}
