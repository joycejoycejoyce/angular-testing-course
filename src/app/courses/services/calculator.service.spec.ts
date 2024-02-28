import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe('CalculatorService', () => {
    // contains a series of specifications 

    // IT is describing a functional feature, you create a sentence starts with it ... 
    it('should add two numbers', () => {
        const logger = new LoggerService();
        /* Jasmine will take an instance of the LoggerService
           and replace the log method with a new method
           and will track how many times this function is been called 
        */ 
        spyOn(logger, 'log');

        const calculatorService = new CalculatorService(logger);

        const result = calculatorService.add(2, 3);

        // goal: ensure the result is expected 
        expect(result).toBe(5);

        expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('should substract two numbers', () => {
        const calculatorService = new CalculatorService(new LoggerService());
        const result = calculatorService.subtract(3, 2);

        // assert 
        expect(result).toBe(1);
    })
});