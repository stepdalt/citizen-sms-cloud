/*
To use this directive:
1. Add: appStopPropagation to dom elements that you want to stop propagation.
*/
import {Directive, HostListener} from '@angular/core';

/**
 * This directive simply adds stop propagation to a dom element.
 */

@Directive({
    selector: '[appStopPropagation]'
})
export class StopPropagationDirective {
    @HostListener('click', ['$event'])
    public onClick(event: any): void {
        event.stopPropagation();
        event.preventDefault();
    }
}
