import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
//import { FormUtilsService } from './../../../shared/services/form-utils.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent {

  form = this.formBuilder.group({
      _id: [''],
      name: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)]],
      category: ['', [Validators.required]]
    });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private _snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    //public formUtils: FormUtilsService
    ) {
      const course: Course = this.route.snapshot.data['course'];
      this.form.setValue({
        _id: course._id,
        name: course.name,
        category: course.category
      })
    };

  onSubmit() {
    //if (this.form.valid) {
      this.service.save(this.form.value).subscribe({
        next: data => this.onSuccess(),
        error: error => this.onError()
      });
    // //} else {
    //   this.formUtils.validateAllFormFields(this.form);
    // }
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

  getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return "Campo obrigatório";
    }

    if (field?.hasError('minlength')) {
      const requiredLength: number = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return `Tamanho mínimo precisa ser de ${requiredLength} caracteres`;
    }

    if (field?.hasError('maxlength')) {
      const requiredLength: number = field.errors ? field.errors['maxlength']['requiredLength'] : 100;
      return `Tamanho maxímo precisa ser de ${requiredLength} caracteres`;
    }

    return "Campo inválido";
  }

}
