import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class Helpers {

    constructor() { }

    // load scripts dynamically
    loadDynamicScripts(dynamicScripts: Array<string>) {
        for (let i = 0; i < dynamicScripts.length; i++) {
            const node = document.createElement('script');
            node.src = dynamicScripts[i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    }
}

