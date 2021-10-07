// -v2-import { CustomErrorStateMatcher } from './curtom-state-matcher';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';

// -v2- Error when invalid control is dirty, touched, or submitted.
export class CustomStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!isSubmitted;
    // -v2- return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

// this.form.updateOn == change
// https://stackoverflow.com/questions/48216330/angular-5-formgroup-reset-doesnt-reset-validators?answertab=votes#tab-top


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form: FormGroup;
  formStyle: string = 'form-default';
  titleText: string = 'ErrorStateMatcher';
  titleHint: string = 'Show error when invalid form is submitted';
  currentMode = 'matcher';
  btnText: string = 'Check';
  btnStyle: string = 'accent';
  matcher: any = new CustomStateMatcher();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: new FormControl(''),
      email: new FormControl(''),
    });
  }

  defaultError() {
    this.currentMode = 'default';
    this.titleText = 'Default ErrorState';
    this.titleHint = 'Show error when control is invalid';

    this.matcher = null;
    this.clearError();
    this.form['controls'].name.setValidators([
      Validators.maxLength(20),
      Validators.required,
    ]);
    this.form['controls'].email.setValidators([
      Validators.email,
      Validators.maxLength(30),
      Validators.required,
    ]);
    this.form['controls'].name.updateValueAndValidity({ onlySelf: true });
    this.form['controls'].email.updateValueAndValidity({ onlySelf: true });
  }

  matcherError() {
    this.currentMode = 'matcher';
    this.titleText = 'ErrorStateMatcher';
    this.titleHint = 'Show error when invalid form is submitted';

    if (this.matcher === null) this.matcher = new CustomStateMatcher();
  }

  clearError() {
    this.form['controls'].name.setErrors(null);
    this.form['controls'].email.setErrors(null);
    this.form['controls'].name.clearValidators();
    this.form['controls'].email.clearValidators();
    this.form['controls'].name.updateValueAndValidity({ onlySelf: true });
    this.form['controls'].email.updateValueAndValidity({ onlySelf: true });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  switchErrorMode(choice: string) {
    if (choice === 'default') {
      this.defaultError();
    } else {
      this.matcherError();
    }
  }

  onSubmit(formData: any, formDirective: FormGroupDirective) {
    if (this.formStyle === 'form-default') {
      this.btnText = 'Clean out';
      this.formStyle = 'form-change';
      this.btnStyle = 'primary';
      this.switchErrorMode(this.currentMode);
    } else {
      this.btnText = 'Check';
      this.formStyle = 'form-default';
      this.btnStyle = 'accent';
      this.matcher = false;
      formDirective.resetForm();
      this.form.reset();
      this.clearError();
    }
  }
}
