import { fakeAsync, flush, tick } from "@angular/core/testing";

describe('Async Operation Test Examples', () => {
    it('Fake Async + Tick', fakeAsync(() => {
        let flag = false; 

        setTimeout(() => {
            flag = true; 
            expect(flag).toBe(true);
        }, 1000);

        // time advance 900 ms
        tick(900); 

        // time advance 1000 ms
        tick(100);
    }));

    fit('Fake Async + Flush', fakeAsync(() => {
        let flag = false; 

        setTimeout(() => {
            flag = true; 
            console.log('1st async function');
            expect(flag).toBe(true);
        }, 1000);

        setTimeout(() => {
            console.log('2nd async function');
        }, 2000);

        // execute all async operaitons 
        flush();

        expect(flag).toBe(true);
    }));
});