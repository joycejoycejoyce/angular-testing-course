import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from '@angular/core/testing';

describe('CalculatorService', () => {
    /**
     * create global variables that can be accessed by all test cases 
     */
    let logger: LoggerService; 
    let calculatorService: any; 
    /**
     * inside the beforeEach block, are codes executed before each unit test case
     */
    beforeEach(() => {
        /* Jasmine will create a fake instance of the loggerService 
           and replace the log method with a new method
           and will track how many times this function is been called 
        */ 
           logger = jasmine.createSpyObj('loggerService', ['log']);

           TestBed.configureTestingModule({
            /* needed services */
            providers: [
                // will create an actual calculator service instance
                CalculatorService,
                // will create a fake logger service instance 
                {provide: LoggerService, useValue: logger}
            ]
           })
           calculatorService = TestBed.inject(CalculatorService);
    })



    // contains a series of specifications 

    // IT is describing a functional feature, you create a sentence starts with it ... 
    it('should add two numbers', () => {
        

        const result = calculatorService.add(2, 3);

        // goal: ensure the result is expected 
        expect(result).toBe(5);

        // goal: ensure the 'log' method is only been called 1 time
        expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('should substract two numbers', () => {
        /*
        ['<method_name>']: means for this mocked object, the method 'log' will be added inside
        if not added, later when we do loggerService.log, an error will pop up
        */
        const loggerService = jasmine.createSpyObj('LoggerService', ['log']);
        
        const calculatorService = new CalculatorService(loggerService);

        const result = calculatorService.subtract(3, 2);

        // assert 
        expect(result).toBe(1);

        expect(loggerService.log).toHaveBeenCalledTimes(1);
    })
});