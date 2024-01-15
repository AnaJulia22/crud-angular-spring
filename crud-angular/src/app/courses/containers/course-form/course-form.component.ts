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

  form!: FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private _snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    //public formUtils: FormUtilsService
    ) {
      const course: Course = this.route.snapshot.data['course'];
      this.form = this.formBuilder.group({
      _id: [course._id],
      name: [
        course.name,
        [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
      ],
      category: [course.category, [Validators.required]],
      //lessons: this.formBuilder.array(this.retrieveLessons(course), Validators.required)
    });
    }

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

}
