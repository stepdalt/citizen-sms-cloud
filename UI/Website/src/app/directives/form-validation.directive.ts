/*
This directive can be used on a form with a form group to add pl style validation

To use this directive:
1. Add: [appFormValidation]=formgroupname submitted=(boolean of submission) to a form with [formGroup]
*/

import {
    Directive,
    ViewContainerRef,
    Input,
    OnInit,
    Renderer2
} from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

// Note the selector is restricted to forms and should have a [formGroup]='name'
@Directive({
    selector: 'form[appFormValidation]'
})
export class FormValidationDirective implements OnInit {
    @Input() appFormValidation: FormGroup;
    @Input() submitted = false;

    // locally keep track of errors
    formErrors = [];

    constructor(
        private vr: ViewContainerRef,
        private ren: Renderer2
    ) { }

    ngOnInit() {
        this.onChanges();
    }

    // This function monitors changes to the form to re-validate
    private onChanges(): void {
        this.appFormValidation.valueChanges.pipe(
            delay(100),
            tap(val => {
                this.formErrors = [];

                // Get all the validation message blocks produced by the control validation directive
                const errorBlocks = this.vr.element.nativeElement.querySelectorAll('.form-vld-msg');
                let i = 1;
                if (errorBlocks) {
                    errorBlocks.forEach(error => {
                        // The control validation block uses the convention of id'ing blocks with the host name + ^Error
                        this.formErrors.push({ index: i, message: error.textContent, anchor: error.id.replace('^Error', '') });
                        i++;
                    });
                    // If the user tried to submit only then show the validation summary
                    if (this.submitted) {
                        this.addValidationSummary();
                    }
                    // If no error blocks were found clean up the summary
                    if (errorBlocks.length === 0) {
                        this.cleanUp();
                    }
                }
            })
        ).subscribe();
    }

    // Removes the summary window
    private cleanUp() {
        const existing = this.vr.element.nativeElement.querySelector('section');
        if (existing) {
            this.ren.removeChild(this.vr.element.nativeElement, existing);
        }
    }

    private addValidationSummary() {
        // Cleanup first
        this.cleanUp();

        // Section element cration
        const summaryHolder = this.ren.createElement('section');
        this.ren.addClass(summaryHolder, 'alert');
        this.ren.addClass(summaryHolder, 'alert-danger');
        this.ren.setProperty(summaryHolder, 'tabindex', '-1');

        // h2 element creation
        const summaryHeader = this.ren.createElement('h2');
        const errorQuality = (this.formErrors.length === 1) ? ' error was found.' : ' errors were found.';
        const headerText = this.ren.createText('The form could not be submitted because '
            + this.formErrors.length + errorQuality);
        this.ren.appendChild(summaryHeader, headerText);

        // ul element creation here we loop through the errors making an entry for each.
        const summaryList = this.ren.createElement('ul');
        this.formErrors.forEach(formError => {
            const errorList = this.ren.createElement('li');
            const errorAnchor = this.ren.createElement('a');
            this.ren.setProperty(errorAnchor, 'href', `#${formError.anchor}`);
            this.ren.listen(errorAnchor, 'click', ev => { this.followAnchor(ev, formError.anchor); });

            const errorText = this.ren.createElement('span');
            this.ren.addClass(errorText, 'prefix');
            const errorTextMessage = this.ren.createText(`Error ${formError.index}: `);
            this.ren.appendChild(errorText, errorTextMessage);

            this.ren.appendChild(errorAnchor, errorText);
            const anchorText = this.ren.createText(formError.message);
            this.ren.appendChild(errorAnchor, anchorText);

            this.ren.appendChild(errorList, errorAnchor);
            this.ren.appendChild(summaryList, errorList);
        });

        this.ren.appendChild(summaryHolder, summaryHeader);
        this.ren.appendChild(summaryHolder, summaryList);

        // Add it all to the DOM
        this.ren.insertBefore(this.vr.element.nativeElement, summaryHolder, this.vr.element.nativeElement.firstChild);
    }

    // function to jump to the input that had the error
    followAnchor(event, anchorId): void {
        event.stopPropagation();
        event.preventDefault();
        const gotoEl = document.getElementById(anchorId);
        gotoEl.scrollIntoView();
        gotoEl.focus();
    }
}
