import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { Lesson } from '../../model/lesson';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent {

  form!: FormGroup

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private _snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute
    ) {
      const course: Course = this.route.snapshot.data['course'];

      this.form = this.formBuilder.group({
        _id: [course._id],
        name: [course.name, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)]],
        category: [course.category, [Validators.required]],
        lessons: this.formBuilder.array(this.retrieveLesson(course), Validators.required)
      });
      console.log(this.form)
      console.log(this.form.value)
    };

  private retrieveLesson(course: Course) {
    const lessons = []
    if (course?.lessons) {
      course.lessons.forEach(lesson => lessons.push(this.createLesson(lesson)))
    } else {
      lessons.push(this.createLesson());
    }
    return lessons

  }
  private createLesson(lesson: Lesson = {id: '', name: '', youtubeUrl: ''}) {
    return this.formBuilder.group({
      id: [lesson.id],
      name: [lesson.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)]],
      youtubeUrl: [lesson.youtubeUrl, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(11)]]
    });
  }

  getLessonFormArray() {
    return (<UntypedFormArray>this.form.get('lessons')).controls
  }

  addNewLesson() {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.push(this.createLesson());
  }

  removeLesson(index: number){
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.removeAt(index);
  }

  onSubmit() {
    if(this.form.valid) {
      this.service.save(this.form.value).subscribe({
        next: data => this.onSuccess(),
        error: error => this.onError()
      });
    } else {
      alert('Form inválido');
    }
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

  ifFormArrayRequired(){
    const lessons = this.form.get('lessons') as UntypedFormArray;
    return !lessons.valid && lessons.hasError('required') && lessons.touched;
  }

}
