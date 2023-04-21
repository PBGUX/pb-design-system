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
import { PbdsDatavizScatterplotComponent } from './dataviz-scatterplot.component';
// directives
import { PbdsBarStackedAnnotationsDirective } from './dataviz-bar-stacked-annotations.directive';
import { PbdsLineAnnotationsDirective } from './dataviz-line-annotations.directive';
import { PbdsBarGroupedAnnotationsDirective } from './dataviz-bar-grouped-annotations.directive';
import { PbdsBarAnnotationsDirective } from './dataviz-bar-annotations.directive';
import * as i0 from "@angular/core";
export class PbdsDatavizModule {
}
PbdsDatavizModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsDatavizModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizModule, declarations: [PbdsDatavizPieComponent,
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
        PbdsDatavizScatterplotComponent,
        PbdsBarStackedAnnotationsDirective,
        PbdsLineAnnotationsDirective,
        PbdsBarGroupedAnnotationsDirective,
        PbdsBarAnnotationsDirective], imports: [CommonModule, NgbTooltipModule], exports: [PbdsDatavizPieComponent,
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
        PbdsDatavizScatterplotComponent,
        PbdsBarStackedAnnotationsDirective,
        PbdsLineAnnotationsDirective,
        PbdsBarGroupedAnnotationsDirective,
        PbdsBarAnnotationsDirective] });
PbdsDatavizModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizModule, imports: [CommonModule, NgbTooltipModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDatavizModule, decorators: [{
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
                        PbdsDatavizScatterplotComponent,
                        PbdsBarStackedAnnotationsDirective,
                        PbdsLineAnnotationsDirective,
                        PbdsBarGroupedAnnotationsDirective,
                        PbdsBarAnnotationsDirective
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
                        PbdsDatavizScatterplotComponent,
                        PbdsBarStackedAnnotationsDirective,
                        PbdsLineAnnotationsDirective,
                        PbdsBarGroupedAnnotationsDirective,
                        PbdsBarAnnotationsDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFOUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdEUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDakYsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbkYsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0YsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDL0UsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdkYsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDakYsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDcEcsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFbEYsYUFBYTtBQUNiLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ2pHLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ2pHLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDOztBQTZDbEYsTUFBTSxPQUFPLGlCQUFpQjs7OEdBQWpCLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQXpDMUIsdUJBQXVCO1FBQ3ZCLHVCQUF1QjtRQUN2Qix3QkFBd0I7UUFDeEIseUJBQXlCO1FBQ3pCLDZCQUE2QjtRQUM3Qiw4QkFBOEI7UUFDOUIsK0JBQStCO1FBQy9CLDZCQUE2QjtRQUM3QixtQ0FBbUM7UUFDbkMsMkJBQTJCO1FBQzNCLGlDQUFpQztRQUNqQyw4QkFBOEI7UUFDOUIsdUNBQXVDO1FBQ3ZDLCtCQUErQjtRQUMvQixrQ0FBa0M7UUFDbEMsNEJBQTRCO1FBQzVCLGtDQUFrQztRQUNsQywyQkFBMkIsYUFFbkIsWUFBWSxFQUFFLGdCQUFnQixhQUV0Qyx1QkFBdUI7UUFDdkIsdUJBQXVCO1FBQ3ZCLHdCQUF3QjtRQUN4Qix5QkFBeUI7UUFDekIsNkJBQTZCO1FBQzdCLDhCQUE4QjtRQUM5QiwrQkFBK0I7UUFDL0IsNkJBQTZCO1FBQzdCLG1DQUFtQztRQUNuQywyQkFBMkI7UUFDM0IsaUNBQWlDO1FBQ2pDLDhCQUE4QjtRQUM5Qix1Q0FBdUM7UUFDdkMsK0JBQStCO1FBQy9CLGtDQUFrQztRQUNsQyw0QkFBNEI7UUFDNUIsa0NBQWtDO1FBQ2xDLDJCQUEyQjsrR0FHbEIsaUJBQWlCLFlBdEJsQixZQUFZLEVBQUUsZ0JBQWdCOzJGQXNCN0IsaUJBQWlCO2tCQTNDN0IsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osdUJBQXVCO3dCQUN2Qix1QkFBdUI7d0JBQ3ZCLHdCQUF3Qjt3QkFDeEIseUJBQXlCO3dCQUN6Qiw2QkFBNkI7d0JBQzdCLDhCQUE4Qjt3QkFDOUIsK0JBQStCO3dCQUMvQiw2QkFBNkI7d0JBQzdCLG1DQUFtQzt3QkFDbkMsMkJBQTJCO3dCQUMzQixpQ0FBaUM7d0JBQ2pDLDhCQUE4Qjt3QkFDOUIsdUNBQXVDO3dCQUN2QywrQkFBK0I7d0JBQy9CLGtDQUFrQzt3QkFDbEMsNEJBQTRCO3dCQUM1QixrQ0FBa0M7d0JBQ2xDLDJCQUEyQjtxQkFDNUI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDO29CQUN6QyxPQUFPLEVBQUU7d0JBQ1AsdUJBQXVCO3dCQUN2Qix1QkFBdUI7d0JBQ3ZCLHdCQUF3Qjt3QkFDeEIseUJBQXlCO3dCQUN6Qiw2QkFBNkI7d0JBQzdCLDhCQUE4Qjt3QkFDOUIsK0JBQStCO3dCQUMvQiw2QkFBNkI7d0JBQzdCLG1DQUFtQzt3QkFDbkMsMkJBQTJCO3dCQUMzQixpQ0FBaUM7d0JBQ2pDLDhCQUE4Qjt3QkFDOUIsdUNBQXVDO3dCQUN2QywrQkFBK0I7d0JBQy9CLGtDQUFrQzt3QkFDbEMsNEJBQTRCO3dCQUM1QixrQ0FBa0M7d0JBQ2xDLDJCQUEyQjtxQkFDNUI7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgTmdiVG9vbHRpcE1vZHVsZSB9IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcblxuaW1wb3J0IHsgUGJkc0RhdGF2aXpQaWVDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotcGllLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhckNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1iYXIuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6TGluZUNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1saW5lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekdhdWdlQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWdhdWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpelNwYXJrbGluZUNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1zcGFya2xpbmUuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyU3RhY2tlZENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1iYXItc3RhY2tlZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpNZXRyaWNCbG9ja0NvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1tZXRyaWMtYmxvY2suY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LW1ldHJpYy1pbmRpY2F0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWJ1YmJsZS1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6SGVhdG1hcENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1oZWF0bWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotY2hvcm9wbGV0aC1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyR3JvdXBlZENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1iYXItZ3JvdXBlZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXJTaW5nbGVIb3Jpem9udGFsQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWJhci1zaW5nbGUtaG9yaXpvbnRhbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpTY2F0dGVycGxvdENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1zY2F0dGVycGxvdC5jb21wb25lbnQnO1xuXG4vLyBkaXJlY3RpdmVzXG5pbXBvcnQgeyBQYmRzQmFyU3RhY2tlZEFubm90YXRpb25zRGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRhdml6LWJhci1zdGFja2VkLWFubm90YXRpb25zLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBQYmRzTGluZUFubm90YXRpb25zRGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRhdml6LWxpbmUtYW5ub3RhdGlvbnMuZGlyZWN0aXZlJztcbmltcG9ydCB7IFBiZHNCYXJHcm91cGVkQW5ub3RhdGlvbnNEaXJlY3RpdmUgfSBmcm9tICcuL2RhdGF2aXotYmFyLWdyb3VwZWQtYW5ub3RhdGlvbnMuZGlyZWN0aXZlJztcbmltcG9ydCB7IFBiZHNCYXJBbm5vdGF0aW9uc0RpcmVjdGl2ZSB9IGZyb20gJy4vZGF0YXZpei1iYXItYW5ub3RhdGlvbnMuZGlyZWN0aXZlJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgUGJkc0RhdGF2aXpQaWVDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpMaW5lQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6R2F1Z2VDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpTcGFya2xpbmVDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJTdGFja2VkQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TWV0cmljQmxvY2tDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCdWJibGVNYXBDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpNZXRyaWNJbmRpY2F0b3JDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpIZWF0bWFwQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6Q2hvcm9wbGV0aE1hcENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekJhckdyb3VwZWRDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJTaW5nbGVIb3Jpem9udGFsQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6U2NhdHRlcnBsb3RDb21wb25lbnQsXG4gICAgUGJkc0JhclN0YWNrZWRBbm5vdGF0aW9uc0RpcmVjdGl2ZSxcbiAgICBQYmRzTGluZUFubm90YXRpb25zRGlyZWN0aXZlLFxuICAgIFBiZHNCYXJHcm91cGVkQW5ub3RhdGlvbnNEaXJlY3RpdmUsXG4gICAgUGJkc0JhckFubm90YXRpb25zRGlyZWN0aXZlXG4gIF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE5nYlRvb2x0aXBNb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgUGJkc0RhdGF2aXpQaWVDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpMaW5lQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6R2F1Z2VDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpTcGFya2xpbmVDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJTdGFja2VkQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TWV0cmljQmxvY2tDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCdWJibGVNYXBDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpNZXRyaWNJbmRpY2F0b3JDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpIZWF0bWFwQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6Q2hvcm9wbGV0aE1hcENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekJhckdyb3VwZWRDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJTaW5nbGVIb3Jpem9udGFsQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6U2NhdHRlcnBsb3RDb21wb25lbnQsXG4gICAgUGJkc0JhclN0YWNrZWRBbm5vdGF0aW9uc0RpcmVjdGl2ZSxcbiAgICBQYmRzTGluZUFubm90YXRpb25zRGlyZWN0aXZlLFxuICAgIFBiZHNCYXJHcm91cGVkQW5ub3RhdGlvbnNEaXJlY3RpdmUsXG4gICAgUGJkc0JhckFubm90YXRpb25zRGlyZWN0aXZlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpNb2R1bGUge31cbiJdfQ==