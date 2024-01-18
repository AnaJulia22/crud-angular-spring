import { Component, ViewChild } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CoursePage } from '../../model/course-page';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {
    courses$: Observable<CoursePage> | null = null;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    pageIndex = 0;
    pageSize = 10;

    constructor(
      private coursesService: CoursesService,
      public dialog: MatDialog,
      private router: Router,
      private route: ActivatedRoute,
      private _snackBar: MatSnackBar,
      ) {
      this.refresh();
    }

    refresh(pageEvent: PageEvent = {length: 0, pageIndex: 0, pageSize: 10}) {
      this.courses$ = this.coursesService.list(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(
        tap( ()=>{
          this.pageIndex = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
        }),
        catchError(error => {
          this.onError('Erro ao carregar cursos.')
          return of({courses: [], totalElements: 0, totalPages: 0})
        })
      );
    }

    onError(errorMsg: string) {
      this.dialog.open(ErrorDialogComponent, {
        data: errorMsg
      });
    }

    onAdd() {
      this.router.navigate(['new'], {relativeTo: this.route});
    }

    onEdit(course: Course) {
      this.router.navigate(['edit', course._id], {relativeTo: this.route});
    }

    onRemove(course: Course) {

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: 'Tem certeza que gostaria de remover o curso?'
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.coursesService.remove(course._id).subscribe({
            next: data => {
              this.refresh();
              this._snackBar.open("Curso removido com sucesso","X",{
                duration:5000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
            },
            error: error => this.onError('Erro ao tentar remover curso')
          });
        }
      });
    }
}
