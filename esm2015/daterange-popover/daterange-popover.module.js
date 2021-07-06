import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbPopoverModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatRadioModule } from '@angular/material/radio';
import { A11yModule } from '@angular/cdk/a11y';
import { PbdsDaterangePopoverComponent } from './daterange-popover.component';
export class PbdsDaterangePopoverModule {
}
PbdsDaterangePopoverModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PbdsDaterangePopoverComponent],
                imports: [
                    CommonModule,
                    FormsModule,
                    A11yModule,
                    MatRadioModule,
                    NgbDatepickerModule,
                    NgbPopoverModule,
                    NgbDropdownModule
                ],
                exports: [PbdsDaterangePopoverComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRlcmFuZ2UtcG9wb3Zlci9kYXRlcmFuZ2UtcG9wb3Zlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTdDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRXRHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFL0MsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFlOUUsTUFBTSxPQUFPLDBCQUEwQjs7O1lBYnRDLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQztnQkFDN0MsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osV0FBVztvQkFDWCxVQUFVO29CQUNWLGNBQWM7b0JBQ2QsbUJBQW1CO29CQUNuQixnQkFBZ0I7b0JBQ2hCLGlCQUFpQjtpQkFDbEI7Z0JBQ0QsT0FBTyxFQUFFLENBQUMsNkJBQTZCLENBQUM7YUFDekMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBOZ2JEYXRlcGlja2VyTW9kdWxlLCBOZ2JQb3BvdmVyTW9kdWxlLCBOZ2JEcm9wZG93bk1vZHVsZSB9IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcblxuaW1wb3J0IHsgTWF0UmFkaW9Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9yYWRpbyc7XG5pbXBvcnQgeyBBMTF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuXG5pbXBvcnQgeyBQYmRzRGF0ZXJhbmdlUG9wb3ZlckNvbXBvbmVudCB9IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbUGJkc0RhdGVyYW5nZVBvcG92ZXJDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlLFxuICAgIEExMXlNb2R1bGUsXG4gICAgTWF0UmFkaW9Nb2R1bGUsXG4gICAgTmdiRGF0ZXBpY2tlck1vZHVsZSxcbiAgICBOZ2JQb3BvdmVyTW9kdWxlLFxuICAgIE5nYkRyb3Bkb3duTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtQYmRzRGF0ZXJhbmdlUG9wb3ZlckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGVyYW5nZVBvcG92ZXJNb2R1bGUge31cbiJdfQ==