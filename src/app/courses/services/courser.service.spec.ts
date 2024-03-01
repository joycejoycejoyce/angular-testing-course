import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service"
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';


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
            console.log('course length: ', courses.length);

            console.log('course: ', courses);
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
    })
    
})