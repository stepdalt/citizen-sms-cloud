/*
This directive can be used on a form control within a form group to add pl style validation

To use this directive:
1. Add: [appControlValidation]=formgroupname to a form control with a form control name and id

i.e. <input id="edit-Name" type="text" class="form-control" formControlName="name" [appControlValidation]='gnomeInfoForm'>
This example contains the minimum: id, formControlName and the directive pointing to the form group.
*/

import {
    Directive,
    ViewContainerRef,
    Input,
    OnInit,
    Renderer2
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Directive({
    selector: '[appControlValidation]'
})
export class ControlValidationDirective implements OnInit {
    @Input() appControlValidation: FormGroup;

    constructor(
        private vr: ViewContainerRef,
        private ren: Renderer2
    ) { }

    ngOnInit() {
        this.onChanges();
    }

    // This function monitors changes to the control to re-validate
    private onChanges(): void {
        this.appControlValidation.valueChanges.pipe(
            tap(val => {
                this.addValidationBlock();
            })
        ).subscribe();
    }

    // Draw the validation warning if input is not valid, currently only supports required
    // but could support any validation type
    private addValidationBlock() {
        // Cleanup first
        const existing = this.vr.element.nativeElement.parentElement.querySelector('.validation-key');
        if (existing) {
            this.ren.removeChild(this.vr.element.nativeElement.parentElement, existing);
        }

        // Create all the elements of a validation warning block
        const containingEl = this.vr.element.nativeElement.parentElement;
        const followingEl = this.vr.element.nativeElement.nextSibling;
        const formControlName = this.vr.element.nativeElement.getAttribute('formControlName');
        const formControlId = this.vr.element.nativeElement.id;
        const formControl = this.appControlValidation.get(formControlName);

        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            const validationHolder = this.ren.createElement('div');
            this.ren.addClass(validationHolder, 'validation-key');
            if (formControl.errors.required) {
              this.addMessageContent(`${formControlName} is required.`, formControlId, validationHolder);
            } else if (formControl.errors.min) {
                this.addMessageContent(`The value of ${formControlName} is below the allowed minimum.`, formControlId, validationHolder);
            } else if (formControl.errors.max) {
                this.addMessageContent(`The value of ${formControlName} exceeds the allowed maximum.`, formControlId, validationHolder);
            } else if (formControl.errors.minlength) {
                this.addMessageContent(`The length of ${formControlName} is below the allowed minimum length.`,
                formControlId, validationHolder);
            } else if (formControl.errors.maxlength) {
                this.addMessageContent(`The length of ${formControlName} is above the allowed maximum length.`,
                formControlId, validationHolder);
            } else if (formControl.errors.matDatepickerFilter) {
                this.addMessageContent(`Selected dates must be in proper order.`, formControlId, validationHolder);
            } else if (formControl.errors) {
                Object.keys(formControl.errors).forEach(errorkey => {
                    if (formControl.errors[errorkey].errorMessage) {
                        this.addMessageContent(formControl.errors[errorkey].errorMessage, formControlId, validationHolder);
                    }
                });
            }

            // Add the block before the next dom element after where the directive is placed
            this.ren.insertBefore(containingEl, validationHolder, followingEl);
        }
    }

    private addMessageContent(message, formControlId, validationHolder) {
        const validationMidHolder = this.ren.createElement('div');

        const validationMessageHolder = this.ren.createElement('span');
        this.ren.setProperty(validationMessageHolder, 'id', `${formControlId}^Error`);
        // this.ren.addClass(validationMessageHolder, 'error-message');
        this.ren.addClass(validationMessageHolder, 'form-vld-msg');
        this.ren.addClass(validationMessageHolder, 'error');
        const validationMessageText = this.ren.createText(message);
        this.ren.appendChild(validationMessageHolder, validationMessageText);
        this.ren.appendChild(validationMidHolder, validationMessageHolder);
        this.ren.appendChild(validationHolder, validationMidHolder);
    }
}
