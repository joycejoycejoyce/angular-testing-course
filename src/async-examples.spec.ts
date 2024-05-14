import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

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

    it('Fake Async + Flush', fakeAsync(() => {
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

    it('Asynchronous test example - plain Promise', fakeAsync(() => {
        let flag = false; 

        console.log('Creating Promise');

        Promise.resolve().then(() => {
            console.log('Promise evaluated successfully');
            flag = true;
        })

        flushMicrotasks();

        console.log('Running test assertions');
        // we expect the result is true
        expect(flag).toBeTruthy();
    }));


    it('Asynchronous test example - Promises + setTimeout()',fakeAsync( () => {
        let counter = 0; 
        Promise.resolve().then(() => {
            counter += 10; 

            setTimeout(() => {
                counter += 1; 
            }, 1000);
        });

        // at this point, neither promise nor setTimeout were done 
        expect(counter).toBe(0);

        // at this point, microtask is executed 
        flushMicrotasks(); 
        expect(counter).toBe(10);

        // at this point, the macrotask is executed 
        tick(1000);
        expect(counter).toBe(11);
    }));


    it('Observable test - Sync', () => {
        let flag = false; 

        let source$ = of(true);
        
        source$.subscribe((value) => {
            flag = value;
        })

        expect(flag).toBeTruthy();
    });

    it('Observable test - Async', fakeAsync(() => {
        let flag = false; 

        // delay: internally use setTimeout
        let source$ = of(true).pipe(delay(1000)); 
        source$.subscribe((data) => {
            flag = data;
        })

        // should execute before the subscribe() sections
        expect(flag).toBeFalsy(); 

        // turn time 1 sec 
        tick(1000);
        expect(flag).toBeTruthy();
    }));
});