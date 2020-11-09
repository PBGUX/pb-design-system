import { NgModule } from '@angular/core';
import { PbdsDatavizModule } from './dataviz/dataviz.module';
import { PbdsHeaderShadowModule } from './header-shadow/header-shadow.module';
import { PbdsDaterangePopoverModule } from './daterange-popover/daterange-popover.module';
import { PbdsPageTitleModule } from './page-title/page-title.module';
import { PbdsColumnToggleModule } from './column-toggle/column-toggle.module';
export class PbdsComponentsModule {
}
PbdsComponentsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [],
                imports: [
                    PbdsDatavizModule,
                    PbdsHeaderShadowModule,
                    PbdsDaterangePopoverModule,
                    PbdsPageTitleModule,
                    PbdsColumnToggleModule
                ],
                exports: [
                    PbdsDatavizModule,
                    PbdsHeaderShadowModule,
                    PbdsDaterangePopoverModule,
                    PbdsPageTitleModule,
                    PbdsColumnToggleModule
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGJkcy1jb21wb25lbnRzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZGEwNTdjby9EZXNrdG9wL0NvZGUvbmctZGVzaWduc3lzdGVtL2NsaWVudC9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtLyIsInNvdXJjZXMiOlsicGJkcy1jb21wb25lbnRzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRTdELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzlFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQzFGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBbUI5RSxNQUFNLE9BQU8sb0JBQW9COzs7WUFqQmhDLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsRUFBRTtnQkFDaEIsT0FBTyxFQUFFO29CQUNQLGlCQUFpQjtvQkFDakIsc0JBQXNCO29CQUN0QiwwQkFBMEI7b0JBQzFCLG1CQUFtQjtvQkFDbkIsc0JBQXNCO2lCQUN2QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsaUJBQWlCO29CQUNqQixzQkFBc0I7b0JBQ3RCLDBCQUEwQjtvQkFDMUIsbUJBQW1CO29CQUNuQixzQkFBc0I7aUJBQ3ZCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpek1vZHVsZSB9IGZyb20gJy4vZGF0YXZpei9kYXRhdml6Lm1vZHVsZSc7XG5cbmltcG9ydCB7IFBiZHNIZWFkZXJTaGFkb3dNb2R1bGUgfSBmcm9tICcuL2hlYWRlci1zaGFkb3cvaGVhZGVyLXNoYWRvdy5tb2R1bGUnO1xuaW1wb3J0IHsgUGJkc0RhdGVyYW5nZVBvcG92ZXJNb2R1bGUgfSBmcm9tICcuL2RhdGVyYW5nZS1wb3BvdmVyL2RhdGVyYW5nZS1wb3BvdmVyLm1vZHVsZSc7XG5pbXBvcnQgeyBQYmRzUGFnZVRpdGxlTW9kdWxlIH0gZnJvbSAnLi9wYWdlLXRpdGxlL3BhZ2UtdGl0bGUubW9kdWxlJztcbmltcG9ydCB7IFBiZHNDb2x1bW5Ub2dnbGVNb2R1bGUgfSBmcm9tICcuL2NvbHVtbi10b2dnbGUvY29sdW1uLXRvZ2dsZS5tb2R1bGUnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtdLFxuICBpbXBvcnRzOiBbXG4gICAgUGJkc0RhdGF2aXpNb2R1bGUsXG4gICAgUGJkc0hlYWRlclNoYWRvd01vZHVsZSxcbiAgICBQYmRzRGF0ZXJhbmdlUG9wb3Zlck1vZHVsZSxcbiAgICBQYmRzUGFnZVRpdGxlTW9kdWxlLFxuICAgIFBiZHNDb2x1bW5Ub2dnbGVNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIFBiZHNEYXRhdml6TW9kdWxlLFxuICAgIFBiZHNIZWFkZXJTaGFkb3dNb2R1bGUsXG4gICAgUGJkc0RhdGVyYW5nZVBvcG92ZXJNb2R1bGUsXG4gICAgUGJkc1BhZ2VUaXRsZU1vZHVsZSxcbiAgICBQYmRzQ29sdW1uVG9nZ2xlTW9kdWxlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0NvbXBvbmVudHNNb2R1bGUge31cbiJdfQ==