import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    switch(value) {
      case 'Front-End' : return 'code';
      case 'Back-End' : return 'computer';
    }
    return 'code';
  }

}
