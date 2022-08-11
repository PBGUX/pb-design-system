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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGF2aXovZGF0YXZpei5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFOUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdEUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDakYsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbkYsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0YsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDL0UsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdkYsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDakYsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDcEcsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFbEYsYUFBYTtBQUNiLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ2pHLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ2pHLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDOztBQTZDbEYsTUFBTSxPQUFPLGlCQUFpQjs7OEdBQWpCLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQXpDMUIsdUJBQXVCO1FBQ3ZCLHVCQUF1QjtRQUN2Qix3QkFBd0I7UUFDeEIseUJBQXlCO1FBQ3pCLDZCQUE2QjtRQUM3Qiw4QkFBOEI7UUFDOUIsK0JBQStCO1FBQy9CLDZCQUE2QjtRQUM3QixtQ0FBbUM7UUFDbkMsMkJBQTJCO1FBQzNCLGlDQUFpQztRQUNqQyw4QkFBOEI7UUFDOUIsdUNBQXVDO1FBQ3ZDLCtCQUErQjtRQUMvQixrQ0FBa0M7UUFDbEMsNEJBQTRCO1FBQzVCLGtDQUFrQztRQUNsQywyQkFBMkIsYUFFbkIsWUFBWSxFQUFFLGdCQUFnQixhQUV0Qyx1QkFBdUI7UUFDdkIsdUJBQXVCO1FBQ3ZCLHdCQUF3QjtRQUN4Qix5QkFBeUI7UUFDekIsNkJBQTZCO1FBQzdCLDhCQUE4QjtRQUM5QiwrQkFBK0I7UUFDL0IsNkJBQTZCO1FBQzdCLG1DQUFtQztRQUNuQywyQkFBMkI7UUFDM0IsaUNBQWlDO1FBQ2pDLDhCQUE4QjtRQUM5Qix1Q0FBdUM7UUFDdkMsK0JBQStCO1FBQy9CLGtDQUFrQztRQUNsQyw0QkFBNEI7UUFDNUIsa0NBQWtDO1FBQ2xDLDJCQUEyQjsrR0FHbEIsaUJBQWlCLFlBdEJuQixDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQzsyRkFzQjlCLGlCQUFpQjtrQkEzQzdCLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLHVCQUF1Qjt3QkFDdkIsdUJBQXVCO3dCQUN2Qix3QkFBd0I7d0JBQ3hCLHlCQUF5Qjt3QkFDekIsNkJBQTZCO3dCQUM3Qiw4QkFBOEI7d0JBQzlCLCtCQUErQjt3QkFDL0IsNkJBQTZCO3dCQUM3QixtQ0FBbUM7d0JBQ25DLDJCQUEyQjt3QkFDM0IsaUNBQWlDO3dCQUNqQyw4QkFBOEI7d0JBQzlCLHVDQUF1Qzt3QkFDdkMsK0JBQStCO3dCQUMvQixrQ0FBa0M7d0JBQ2xDLDRCQUE0Qjt3QkFDNUIsa0NBQWtDO3dCQUNsQywyQkFBMkI7cUJBQzVCO29CQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztvQkFDekMsT0FBTyxFQUFFO3dCQUNQLHVCQUF1Qjt3QkFDdkIsdUJBQXVCO3dCQUN2Qix3QkFBd0I7d0JBQ3hCLHlCQUF5Qjt3QkFDekIsNkJBQTZCO3dCQUM3Qiw4QkFBOEI7d0JBQzlCLCtCQUErQjt3QkFDL0IsNkJBQTZCO3dCQUM3QixtQ0FBbUM7d0JBQ25DLDJCQUEyQjt3QkFDM0IsaUNBQWlDO3dCQUNqQyw4QkFBOEI7d0JBQzlCLHVDQUF1Qzt3QkFDdkMsK0JBQStCO3dCQUMvQixrQ0FBa0M7d0JBQ2xDLDRCQUE0Qjt3QkFDNUIsa0NBQWtDO3dCQUNsQywyQkFBMkI7cUJBQzVCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IE5nYlRvb2x0aXBNb2R1bGUgfSBmcm9tICdAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcCc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6UGllQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LXBpZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXJDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekxpbmVDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotbGluZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpHYXVnZUNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1nYXVnZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpTcGFya2xpbmVDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotc3BhcmtsaW5lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhclN0YWNrZWRDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotYmFyLXN0YWNrZWQuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6TWV0cmljQmxvY2tDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotbWV0cmljLWJsb2NrLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpek1ldHJpY0luZGljYXRvckNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJ1YmJsZU1hcENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1idWJibGUtbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekhlYXRtYXBDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotaGVhdG1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpDaG9yb3BsZXRoTWFwQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWNob3JvcGxldGgtbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhckdyb3VwZWRDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotYmFyLWdyb3VwZWQuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1iYXItc2luZ2xlLWhvcml6b250YWwuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6U2NhdHRlcnBsb3RDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotc2NhdHRlcnBsb3QuY29tcG9uZW50JztcblxuLy8gZGlyZWN0aXZlc1xuaW1wb3J0IHsgUGJkc0JhclN0YWNrZWRBbm5vdGF0aW9uc0RpcmVjdGl2ZSB9IGZyb20gJy4vZGF0YXZpei1iYXItc3RhY2tlZC1hbm5vdGF0aW9ucy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgUGJkc0xpbmVBbm5vdGF0aW9uc0RpcmVjdGl2ZSB9IGZyb20gJy4vZGF0YXZpei1saW5lLWFubm90YXRpb25zLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBQYmRzQmFyR3JvdXBlZEFubm90YXRpb25zRGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRhdml6LWJhci1ncm91cGVkLWFubm90YXRpb25zLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBQYmRzQmFyQW5ub3RhdGlvbnNEaXJlY3RpdmUgfSBmcm9tICcuL2RhdGF2aXotYmFyLWFubm90YXRpb25zLmRpcmVjdGl2ZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIFBiZHNEYXRhdml6UGllQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TGluZUNvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekdhdWdlQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6U3BhcmtsaW5lQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU3RhY2tlZENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpek1ldHJpY0Jsb2NrQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6SGVhdG1hcENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJHcm91cGVkQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpelNjYXR0ZXJwbG90Q29tcG9uZW50LFxuICAgIFBiZHNCYXJTdGFja2VkQW5ub3RhdGlvbnNEaXJlY3RpdmUsXG4gICAgUGJkc0xpbmVBbm5vdGF0aW9uc0RpcmVjdGl2ZSxcbiAgICBQYmRzQmFyR3JvdXBlZEFubm90YXRpb25zRGlyZWN0aXZlLFxuICAgIFBiZHNCYXJBbm5vdGF0aW9uc0RpcmVjdGl2ZVxuICBdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBOZ2JUb29sdGlwTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIFBiZHNEYXRhdml6UGllQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TGluZUNvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekdhdWdlQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6U3BhcmtsaW5lQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU3RhY2tlZENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpek1ldHJpY0Jsb2NrQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6SGVhdG1hcENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJHcm91cGVkQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpelNjYXR0ZXJwbG90Q29tcG9uZW50LFxuICAgIFBiZHNCYXJTdGFja2VkQW5ub3RhdGlvbnNEaXJlY3RpdmUsXG4gICAgUGJkc0xpbmVBbm5vdGF0aW9uc0RpcmVjdGl2ZSxcbiAgICBQYmRzQmFyR3JvdXBlZEFubm90YXRpb25zRGlyZWN0aXZlLFxuICAgIFBiZHNCYXJBbm5vdGF0aW9uc0RpcmVjdGl2ZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6TW9kdWxlIHt9XG4iXX0=