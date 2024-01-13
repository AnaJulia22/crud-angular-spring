import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NonNullableFormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CoursesService } from '../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent {

  form= this.formBuilder.group({
    name: [''],
    category: ['']
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private _snackBar: MatSnackBar,
    private location: Location
    ) {}

  onSubmit() {
    this.service.save(this.form.value).subscribe({
      next: data => this.onSuccess(),
      error: error => this.onError()
    });
  }

  onClean() {
    this.form.reset({
      name: '',
      category: ''
    });
  }

  onCancel() {
  this.location.back();
  }

  private onSuccess() {
    this._snackBar.open("Curso salvo com sucesso","",{duration:5000});
    this.onCancel();
  }

  private onError() {
    this._snackBar.open("Erro ao salvar curso","",{duration:5000});
  }

}
