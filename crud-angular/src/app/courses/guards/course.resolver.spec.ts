import { TestBed } from '@angular/core/testing';

import { CourseResolver } from './course.resolver';

describe('courseResolver', () => {
  let resolver: CourseResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
