import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';
import { filter } from 'rxjs/operators';
import { Course } from '../model/course';
import { template } from 'cypress/types/lodash';
import { all } from 'cypress/types/bluebird';




describe('HomeComponent', async () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  beforeEach(async () => {
    
    coursesService = jasmine.createSpyObj('CoursesService', ['findAllCourses']);
    await TestBed.configureTestingModule({
      /**
       * imports NoopAnimationsModule: 
       *  to disable animation for testing purposes 
       *  - disable animations to simplify the testing env, eliminate the need to wait for animations 
       *    to complete during testing.
       */
      imports: [CoursesModule, NoopAnimationsModule], 
      providers: [{provide: CoursesService, useValue: coursesService}]
    }).compileComponents();
    
    
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement; 

    /**
     * Retrieving an instance of the CoursesService from the TestBed injector 
     * Ensures that the test has access to the mock CoursesService instance that has been 
     * configured for testing purposes 
     */

    // TestBed.get() will return a type of any 
    coursesService = TestBed.get(CoursesService);
  });

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });

  /**
   * Test when data only contains beginner courses, there should only contain 1 tab for beginner courses
   */
  it("should display only beginner courses", () => {
    const beginnerCourses = Object.values(COURSES).filter((course: Course) => {
      return course.category === 'BEGINNER';
    });
    
    /** only load in for beginner courses data */
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    // detect data change in the template
    fixture.detectChanges();

    // query all the tab elements in the template 
    const tabElements = el.queryAll(By.css('.mdc-tab'));
    // assert there should only have 1 tab group exist for beginner courses 
    expect(tabElements.length).toEqual(1, 'Have unexpected number of tabs');
  });


  it("should display only advanced courses", () => {
    const advancedCourses = Object.values(COURSES).filter((course: Course) => {
      return course.category === 'ADVANCED';
    })

    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
      
    fixture.detectChanges();

    const tabElements = el.queryAll(By.css('.mdc-tab'));
    expect(tabElements.length).toEqual(1, 'Have unexpected number of tabs');
  });


  it("should display both tabs", () => {
    const allCourses = Object.values(COURSES);

    coursesService.findAllCourses.and.returnValue(of(allCourses));
    
    fixture.detectChanges();

    const tabElements = el.queryAll(By.css('.mdc-tab'));
    expect(tabElements.length).toEqual(2, 'Have unexpected number of tabs');
  });


  it("should display advanced courses when tab clicked", () => {
    const allCourses = Object.values(COURSES);
    coursesService.findAllCourses.and.returnValue(of(allCourses));

    fixture.detectChanges(); 

    // simulate user clicks the advanced tab 
    const tabs = el.queryAll(By.css('mdc-tab'));
    const advancedTab = tabs[1];
    advancedTab.nativeElement.click();

    // retrive all courses
    const cards = el.queryAll(By.css('mat-card'));

    // make sure there is course exist 
    expect(cards.length).toBeGreaterThan(0, 'The course number should be greater than 0');


  });

});


