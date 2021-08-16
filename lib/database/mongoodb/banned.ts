import { ViewOnce  as _viewOnce } from '.';

export class Banned extends _viewOnce {
	private __database = this.Client.get('banned')
    constructor() {
        super()
    }
	
}