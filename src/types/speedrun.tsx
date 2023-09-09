export type SpeedrunVar = {
	id: string;
	type: string;
	value: string;
}

export enum SpeedrunSubmitState {
	Error = -1,
	Idle,
	Queued,
	Running,
	Success,
}

export type Speedrun = {
	id: string; 
	game: string;			// game url id, e.g. swe1r
	isIL: boolean;
	catRTA: string;
	catIL: string;
	level: string;
	// variables
	variables: { [key: string]: string };
	// times
	timeRT: number;		// times in ms
	timeRTNL: number;
	timeIGT: number;
	// date
	date: string;			// Date.toString(); -> YYYY-MM-DD
	// platform
	platSys: string;
	platReg: string;
	platEmu: boolean;
	// extra
	urlVideo: string;
	urlSplitsIO: string;
	comment: string;
	// moderator options
	modPlayer: string;
	modGuest: boolean;
	modVerify: boolean;
	// internal management
	uiValid: boolean;
	uiEditable: boolean;
	uiExpanded: boolean;
	submitState: SpeedrunSubmitState;
	submitErrMsg: string[];
	submitJson: {};
}

export function NewSpeedrun(): Speedrun {
	return {
		id:				'',
		game:			'swe1r',
		isIL:			true,	
		catRTA:			'',
		catIL:			'',
		level:			'',
		variables:		{},
		timeRT:			0,
		timeRTNL:		0,
		timeIGT:		0,
		date:			Date(),
		platSys:		'',
		platReg:		'',
		platEmu:		false,
		urlVideo:		'',
		urlSplitsIO:	'',
		comment:		'',
		modPlayer:		'',
		modGuest:		false,
		modVerify:		false, 
		uiValid:		false,
		uiEditable:		true,
		uiExpanded:		true,
		submitState:	SpeedrunSubmitState.Idle,
		submitErrMsg:	[],
		submitJson:		{},
	} as Speedrun
}

export function CopySpeedrun(speedrun: Speedrun, newValues: Partial<Speedrun> = {}): Speedrun {
	let newSpeedrun = {...JSON.parse(JSON.stringify(speedrun)) as Speedrun, ...newValues}
	//newSpeedrun.date = new Date(newSpeedrun.date)
	return newSpeedrun
}
