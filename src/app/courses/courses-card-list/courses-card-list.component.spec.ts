import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';




describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;

  let fixure: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      /**
       * Import CoursesModule to simply use all the Modules to test the component
       */
      imports: [CoursesModule],
      declarations: []
    })
    /**
     * Before I can test the Angular component, Angular needs to compile their template
     * to JS code that browser can understand. 
     * 
     * compileComponents() handles this compilation process for me. 
     * 
     * Need to keep in mind, this method is async, therefore we need the async test utility 
     */
    .compileComponents();

    /**
     * a test utility: 
     *  - encapsulate the component instance 
     *  - encapsulate associated DOM element 
     *  - allow you to test both compoent's appearance + behavior 
     */
    fixure = TestBed.createComponent(CoursesCardListComponent);
    component = fixure.componentInstance;
    // access to DOM element 
    el = fixure.debugElement; 
  })

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    // added data to the element 
    component.courses = setupCourses();

    // trigger test to notice the change in HTML template
    // sync change
    fixure.detectChanges();

    // select all element with class = "course-card"
    const courses = el.queryAll(By.css(".course-card"));

    expect(courses).toBeTruthy();
    expect(courses.length).toBe(12);
  });


  it("should display the first course", () => {

      pending();

  });


});


