import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PbdsDatavizPieComponent } from './dataviz-pie.component';
import { PbdsDatavizBarComponent } from './dataviz-bar.component';
import { PbdsDatavizLineComponent } from './dataviz-line.component';
import { PbdsDatavizGaugeComponent } from './dataviz-gauge.component';
import { PbdsDatavizSparklineComponent } from './dataviz-sparkline.component';
import { PbdsDatavizBarStackedComponent } from './dataviz-bar-stacked.component';
import { PbdsDatavizMetricBlockComponent } from './dataviz-metric-block.component';
import { PbdsDatavizMetricIndicatorComponent } from './dataviz-metric-indicator.component';
import { PbdsDatavizBubbleMapComponent } from './dataviz-bubble-map.component';
import { PbdsDatavizHeatmapComponent } from './dataviz-heatmap.component';
import { PbdsDatavizChoroplethMapComponent } from './dataviz-choropleth-map.component';
import { PbdsDatavizBarGroupedComponent } from './dataviz-bar-grouped.component';
import { PbdsDatavizBarSingleHorizontalComponent } from './dataviz-bar-single-horizontal.component';
import { PbdsBarAnnotationsDirective, PbdsBarStackedAnnotationsDirective } from './dataviz-annotations.directive';
import * as i0 from "@angular/core";
export class PbdsDatavizModule {
}
PbdsDatavizModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsDatavizModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizModule, declarations: [PbdsDatavizPieComponent,
        PbdsDatavizBarComponent,
        PbdsDatavizLineComponent,
        PbdsDatavizGaugeComponent,
        PbdsDatavizSparklineComponent,
        PbdsDatavizBarStackedComponent,
        PbdsDatavizMetricBlockComponent,
        PbdsDatavizBubbleMapComponent,
        PbdsDatavizMetricIndicatorComponent,
        PbdsDatavizHeatmapComponent,
        PbdsDatavizChoroplethMapComponent,
        PbdsDatavizBarGroupedComponent,
        PbdsDatavizBarSingleHorizontalComponent,
        PbdsBarAnnotationsDirective,
        PbdsBarStackedAnnotationsDirective], imports: [CommonModule, NgbTooltipModule], exports: [PbdsDatavizPieComponent,
        PbdsDatavizBarComponent,
        PbdsDatavizLineComponent,
        PbdsDatavizGaugeComponent,
        PbdsDatavizSparklineComponent,
        PbdsDatavizBarStackedComponent,
        PbdsDatavizMetricBlockComponent,
        PbdsDatavizBubbleMapComponent,
        PbdsDatavizMetricIndicatorComponent,
        PbdsDatavizHeatmapComponent,
        PbdsDatavizChoroplethMapComponent,
        PbdsDatavizBarGroupedComponent,
        PbdsDatavizBarSingleHorizontalComponent,
        PbdsBarAnnotationsDirective,
        PbdsBarStackedAnnotationsDirective] });
PbdsDatavizModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizModule, imports: [[CommonModule, NgbTooltipModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.6", ngImport: i0, type: PbdsDatavizModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        PbdsDatavizPieComponent,
                        PbdsDatavizBarComponent,
                        PbdsDatavizLineComponent,
                        PbdsDatavizGaugeComponent,
                        PbdsDatavizSparklineComponent,
                        PbdsDatavizBarStackedComponent,
                        PbdsDatavizMetricBlockComponent,
                        PbdsDatavizBubbleMapComponent,
                        PbdsDatavizMetricIndicatorComponent,
                        PbdsDatavizHeatmapComponent,
                        PbdsDatavizChoroplethMapComponent,
                        PbdsDatavizBarGroupedComponent,
                        PbdsDatavizBarSingleHorizontalComponent,
                        PbdsBarAnnotationsDirective,
                        PbdsBarStackedAnnotationsDirective
                    ],
                    imports: [CommonModule, NgbTooltipModule],
                    exports: [
                        PbdsDatavizPieComponent,
                        PbdsDatavizBarComponent,
                        PbdsDatavizLineComponent,
                        PbdsDatavizGaugeComponent,
                        PbdsDatavizSparklineComponent,
                        PbdsDatavizBarStackedComponent,
                        PbdsDatavizMetricBlockComponent,
                        PbdsDatavizBubbleMapComponent,
                        PbdsDatavizMetricIndicatorComponent,
                        PbdsDatavizHeatmapComponent,
                        PbdsDatavizChoroplethMapComponent,
                        PbdsDatavizBarGroupedComponent,
                        PbdsDatavizBarSingleHorizontalComponent,
                        PbdsBarAnnotationsDirective,
                        PbdsBarStackedAnnotationsDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFOUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdEUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDakYsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbkYsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0YsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDL0UsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdkYsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDakYsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDcEcsT0FBTyxFQUFFLDJCQUEyQixFQUFFLGtDQUFrQyxFQUFFLE1BQU0saUNBQWlDLENBQUM7O0FBdUNsSCxNQUFNLE9BQU8saUJBQWlCOzs4R0FBakIsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBbkMxQix1QkFBdUI7UUFDdkIsdUJBQXVCO1FBQ3ZCLHdCQUF3QjtRQUN4Qix5QkFBeUI7UUFDekIsNkJBQTZCO1FBQzdCLDhCQUE4QjtRQUM5QiwrQkFBK0I7UUFDL0IsNkJBQTZCO1FBQzdCLG1DQUFtQztRQUNuQywyQkFBMkI7UUFDM0IsaUNBQWlDO1FBQ2pDLDhCQUE4QjtRQUM5Qix1Q0FBdUM7UUFDdkMsMkJBQTJCO1FBQzNCLGtDQUFrQyxhQUUxQixZQUFZLEVBQUUsZ0JBQWdCLGFBRXRDLHVCQUF1QjtRQUN2Qix1QkFBdUI7UUFDdkIsd0JBQXdCO1FBQ3hCLHlCQUF5QjtRQUN6Qiw2QkFBNkI7UUFDN0IsOEJBQThCO1FBQzlCLCtCQUErQjtRQUMvQiw2QkFBNkI7UUFDN0IsbUNBQW1DO1FBQ25DLDJCQUEyQjtRQUMzQixpQ0FBaUM7UUFDakMsOEJBQThCO1FBQzlCLHVDQUF1QztRQUN2QywyQkFBMkI7UUFDM0Isa0NBQWtDOytHQUd6QixpQkFBaUIsWUFuQm5CLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDOzJGQW1COUIsaUJBQWlCO2tCQXJDN0IsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osdUJBQXVCO3dCQUN2Qix1QkFBdUI7d0JBQ3ZCLHdCQUF3Qjt3QkFDeEIseUJBQXlCO3dCQUN6Qiw2QkFBNkI7d0JBQzdCLDhCQUE4Qjt3QkFDOUIsK0JBQStCO3dCQUMvQiw2QkFBNkI7d0JBQzdCLG1DQUFtQzt3QkFDbkMsMkJBQTJCO3dCQUMzQixpQ0FBaUM7d0JBQ2pDLDhCQUE4Qjt3QkFDOUIsdUNBQXVDO3dCQUN2QywyQkFBMkI7d0JBQzNCLGtDQUFrQztxQkFDbkM7b0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDO29CQUN6QyxPQUFPLEVBQUU7d0JBQ1AsdUJBQXVCO3dCQUN2Qix1QkFBdUI7d0JBQ3ZCLHdCQUF3Qjt3QkFDeEIseUJBQXlCO3dCQUN6Qiw2QkFBNkI7d0JBQzdCLDhCQUE4Qjt3QkFDOUIsK0JBQStCO3dCQUMvQiw2QkFBNkI7d0JBQzdCLG1DQUFtQzt3QkFDbkMsMkJBQTJCO3dCQUMzQixpQ0FBaUM7d0JBQ2pDLDhCQUE4Qjt3QkFDOUIsdUNBQXVDO3dCQUN2QywyQkFBMkI7d0JBQzNCLGtDQUFrQztxQkFDbkM7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgTmdiVG9vbHRpcE1vZHVsZSB9IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpQaWVDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotcGllLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhckNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1iYXIuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6TGluZUNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1saW5lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekdhdWdlQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWdhdWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpelNwYXJrbGluZUNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1zcGFya2xpbmUuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyU3RhY2tlZENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpNZXRyaWNCbG9ja0NvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1tZXRyaWMtYmxvY2suY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LW1ldHJpYy1pbmRpY2F0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWJ1YmJsZS1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6SGVhdG1hcENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1oZWF0bWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotY2hvcm9wbGV0aC1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyR3JvdXBlZENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1iYXItZ3JvdXBlZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXJTaW5nbGVIb3Jpem9udGFsQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWJhci1zaW5nbGUtaG9yaXpvbnRhbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0JhckFubm90YXRpb25zRGlyZWN0aXZlLCBQYmRzQmFyU3RhY2tlZEFubm90YXRpb25zRGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRhdml6LWFubm90YXRpb25zLmRpcmVjdGl2ZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIFBiZHNEYXRhdml6UGllQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TGluZUNvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekdhdWdlQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6U3BhcmtsaW5lQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU3RhY2tlZENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpek1ldHJpY0Jsb2NrQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6SGVhdG1hcENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJHcm91cGVkQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBvbmVudCxcbiAgICBQYmRzQmFyQW5ub3RhdGlvbnNEaXJlY3RpdmUsXG4gICAgUGJkc0JhclN0YWNrZWRBbm5vdGF0aW9uc0RpcmVjdGl2ZVxuICBdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBOZ2JUb29sdGlwTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIFBiZHNEYXRhdml6UGllQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TGluZUNvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekdhdWdlQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6U3BhcmtsaW5lQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU3RhY2tlZENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpek1ldHJpY0Jsb2NrQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6SGVhdG1hcENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJHcm91cGVkQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBvbmVudCxcbiAgICBQYmRzQmFyQW5ub3RhdGlvbnNEaXJlY3RpdmUsXG4gICAgUGJkc0JhclN0YWNrZWRBbm5vdGF0aW9uc0RpcmVjdGl2ZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6TW9kdWxlIHt9XG4iXX0=