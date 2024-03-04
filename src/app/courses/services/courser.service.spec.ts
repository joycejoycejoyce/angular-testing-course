import { COURSES } from './../../../../server/db-data';
import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service"
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { Course } from "../model/course";
import { saveCourse } from '../../../../server/save-course.route';
import { error } from 'console';


describe('CoursesService', () => {
    let coursesService: CoursesService; 
    let httpTestController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService
            ]
        });

        coursesService = TestBed.inject(CoursesService);
        httpTestController = TestBed.inject(HttpTestingController);
    }); 

    afterEach(() => {
        /**
         * make sure all expectations on the http requests have been met
         * make sure there is no more outstanding requests that need to be handled 
         * or that requests were made unexpectedly 
         */
        httpTestController.verify(); 
    })


    it('should retrieve all courses', () => {
        // setup request mock data 
        const ALLCOURSES = {
                12: {
                    id: 12,
                    titles: {
                      description: 'Angular Testing Course',
                      longDescription: 'In-depth guide to Unit Testing and E2E Testing of Angular Applications'
                    },
                    iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-testing-small.png',
                    category: 'BEGINNER',
                    seqNo: 0,
                    url: 'angular-testing-course',
                    lessonsCount: 10,
                  }
        }

        // test assertions regarding returning data
        coursesService.findAllCourses().subscribe(courses => {

            /** check if the data is correct 
             * toBeTruthy: make sure the returned data is not undefined || null 
             */
            expect(courses).toBeTruthy('The returned data is not valid, courses should not be null or undefined');

            expect(courses.length).toBe(1, 'Error msg: Incorrect # of courses returned');

            // get an instance of course 
            const course = courses.find(course => course.id == 12);
            expect(course.titles.description).toBe('Angular Testing Course');
        });

        // Test regarding http request

        /**
         * get 1 instance of test request 
         */
        const request = httpTestController.expectOne('/api/courses');

        // assert the http request type == get 
        expect(request.request.method).toBe('GET');

        // respond with mock data 
        request.flush({payload: Object.values(ALLCOURSES)});
    });


    it('should find a course by id', () => {
        const COURSEID = 12;
        const output = {
            id: 12,
            titles: {
              description: 'Angular Testing Course',
              longDescription: 'In-depth guide to Unit Testing and E2E Testing of Angular Applications'
            },
            iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-testing-small.png',
            category: 'BEGINNER',
            seqNo: 0,
            url: 'angular-testing-course',
            lessonsCount: 10,
          }
        
        coursesService.findCourseById(COURSEID).subscribe((data) => {
            expect(data).toBeTruthy('Its not valid course data been returned');
            expect(data.id).toBe(12);
        });

        const request = httpTestController.expectOne('/api/courses/' + COURSEID);
        expect(request.request.method).toBe('GET');
        
        request.flush(output);
    })
    

    it('should update the course data', () => {
        /** Partial<Course>: means that we can only provide partial property values 
         * Typescript feature 
         */
        const ID = 12; 
        const desc = 'Update description';
        const changes : Partial<Course> = {
            titles: {
                description: desc
            }
        };
        coursesService.saveCourse(12, changes).subscribe(course => {
            expect(course.id).toBe(12);
        });

        const req = httpTestController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');

        // expect the description to be the same in the put request 
        expect(req.request.body.titles.description).toEqual(desc);
        // inject data inside the request 
        /**
         * JavaScript feature ... 
         *  means to combine 2 object features. later one overwrites prev one 
         */
        req.flush({
            ...COURSES[12], 
            ...changes
        })
    })

    it('should give an error if save course fails', () => {
        const changes = {};
        
        coursesService.saveCourse(12, changes).subscribe(
            // method 1: if the call to saveCourse() successed 
            /**
             * should not go inside the MEHTOD 1. Because the method should not be executed successfully 
             */
            (anything) => {
                console.log('anything', anything);
                fail('This call to saveCourse() should not success');
            },
            // method 2: if the call to saveCourse() emit error 
            (error) => {
                // check if the error code == 500, internal server error
                expect(error.status).toBe(500);
            }
        );

        const req = httpTestController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');
        // simulate a failure response 
        // The Angular HTTP Client will interpret the status code provided. 
        req.flush('Error', {status: 500, statusText: 'Internal Server Error'});
    })
})