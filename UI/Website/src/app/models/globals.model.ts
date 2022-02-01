import { Injectable, Inject } from '@angular/core';


import { environment } from '../../environments/environment';

const GLOBALS = 'Globals_';

@Injectable()
export class Globals {


    constructor(@Inject(environment.storage) private storage: any) {

    }


    private _GetItem<T>(key: string): T {
        if (this['_' + key]) {
            return this[`_${key}`] as T;
        }

        try {
            const item = JSON.parse(this.storage.getItem(`${GLOBALS}${key}`));
            return item as T;
        } catch {}
        return undefined;
    }

    private _SetItem<T>(key: string, item: T): void {
        this[`_${key}`] = item;
        this.storage.setItem(`${GLOBALS}${key}`, JSON.stringify(item));
    }
}
