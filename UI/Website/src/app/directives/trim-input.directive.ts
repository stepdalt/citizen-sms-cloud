/*
To use this directive:
1. Add: appTrimInput to input elements that you want to trim whitespace.
*/

import { Directive, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';
import { Validator, AbstractControl, ValidatorFn, NG_VALIDATORS, NgModel } from '@angular/forms';

/**
 * This directive provides trimming of whitespace on inputs. It does this in two stages:
 * First when validating it validates the input to false if there is only whitespace using NoWhitespaceValidator.
 * Second when the input changes it trims the value and refires a model change event.
 */

@Directive({
    selector: '[appTrimInput]',
    providers: [NgModel, { provide: NG_VALIDATORS, useExisting: TrimInputDirective, multi: true }]
})
export class TrimInputDirective implements Validator  {

    // Custom validator
    private valFn = NoWhitespaceValidator();

    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

    // needed from implementing validator, does the custom validation
    validate(control: AbstractControl): { [key: string]: any } {
        return this.valFn(control);
    }

    constructor(private el: ElementRef) {}

    // listen for input change to trigger the trim
    // its important that it does this here to get the trimmed version into the model
    @HostListener('change') onInputChange() {
        const value = this.el.nativeElement.value.trim();
        this.ngModelChange.emit(value);
    }
}

/**
 * Custom validator for this directive to make sure whitespace doesn't validate
 */
export function NoWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (typeof control.value === 'string') {
            const isWhitespace = (control.value || '').trim().length === 0;
            const isValid = !isWhitespace;
            return isValid ? null : { 'whitespace': 'value is only whitespace' };
        }
        return null;
    };
  }
