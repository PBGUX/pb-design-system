import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PbdsColumnToggleComponent } from './column-toggle.component';
export class PbdsColumnToggleModule {
}
PbdsColumnToggleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PbdsColumnToggleComponent],
                imports: [CommonModule, NgbDropdownModule],
                exports: [PbdsColumnToggleComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXRvZ2dsZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2RhMDU3Y28vRGVza3RvcC9Db2RlL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9zcmMvIiwic291cmNlcyI6WyJsaWIvY29sdW1uLXRvZ2dsZS9jb2x1bW4tdG9nZ2xlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMvRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQU90RSxNQUFNLE9BQU8sc0JBQXNCOzs7WUFMbEMsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLHlCQUF5QixDQUFDO2dCQUN6QyxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLENBQUM7Z0JBQzFDLE9BQU8sRUFBRSxDQUFDLHlCQUF5QixDQUFDO2FBQ3JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IE5nYkRyb3Bkb3duTW9kdWxlIH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHsgUGJkc0NvbHVtblRvZ2dsZUNvbXBvbmVudCB9IGZyb20gJy4vY29sdW1uLXRvZ2dsZS5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtQYmRzQ29sdW1uVG9nZ2xlQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTmdiRHJvcGRvd25Nb2R1bGVdLFxuICBleHBvcnRzOiBbUGJkc0NvbHVtblRvZ2dsZUNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0NvbHVtblRvZ2dsZU1vZHVsZSB7fVxuIl19