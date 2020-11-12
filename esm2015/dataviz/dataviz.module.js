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
export class PbdsDatavizModule {
}
PbdsDatavizModule.decorators = [
    { type: NgModule, args: [{
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
                    PbdsDatavizBarSingleHorizontalComponent
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
                    PbdsDatavizBarSingleHorizontalComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2RhMDU3Y28vRGVza3RvcC9Db2RlL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRhdml6LyIsInNvdXJjZXMiOlsiZGF0YXZpei5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFOUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdEUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDakYsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbkYsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0YsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDL0UsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdkYsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDakYsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFtQ3BHLE1BQU0sT0FBTyxpQkFBaUI7OztZQWpDN0IsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRTtvQkFDWix1QkFBdUI7b0JBQ3ZCLHVCQUF1QjtvQkFDdkIsd0JBQXdCO29CQUN4Qix5QkFBeUI7b0JBQ3pCLDZCQUE2QjtvQkFDN0IsOEJBQThCO29CQUM5QiwrQkFBK0I7b0JBQy9CLDZCQUE2QjtvQkFDN0IsbUNBQW1DO29CQUNuQywyQkFBMkI7b0JBQzNCLGlDQUFpQztvQkFDakMsOEJBQThCO29CQUM5Qix1Q0FBdUM7aUJBQ3hDO2dCQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztnQkFDekMsT0FBTyxFQUFFO29CQUNQLHVCQUF1QjtvQkFDdkIsdUJBQXVCO29CQUN2Qix3QkFBd0I7b0JBQ3hCLHlCQUF5QjtvQkFDekIsNkJBQTZCO29CQUM3Qiw4QkFBOEI7b0JBQzlCLCtCQUErQjtvQkFDL0IsNkJBQTZCO29CQUM3QixtQ0FBbUM7b0JBQ25DLDJCQUEyQjtvQkFDM0IsaUNBQWlDO29CQUNqQyw4QkFBOEI7b0JBQzlCLHVDQUF1QztpQkFDeEM7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBOZ2JUb29sdGlwTW9kdWxlIH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuXG5pbXBvcnQgeyBQYmRzRGF0YXZpelBpZUNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1waWUuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpMaW5lQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWxpbmUuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6R2F1Z2VDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotZ2F1Z2UuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6U3BhcmtsaW5lQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LXNwYXJrbGluZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXJTdGFja2VkQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWJhci1zdGFja2VkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpek1ldHJpY0Jsb2NrQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LW1ldHJpYy1ibG9jay5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpNZXRyaWNJbmRpY2F0b3JDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotbWV0cmljLWluZGljYXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCdWJibGVNYXBDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotYnViYmxlLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpIZWF0bWFwQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWhlYXRtYXAuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6Q2hvcm9wbGV0aE1hcENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1jaG9yb3BsZXRoLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXJHcm91cGVkQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWJhci1ncm91cGVkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhclNpbmdsZUhvcml6b250YWxDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotYmFyLXNpbmdsZS1ob3Jpem9udGFsLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIFBiZHNEYXRhdml6UGllQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TGluZUNvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekdhdWdlQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6U3BhcmtsaW5lQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU3RhY2tlZENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpek1ldHJpY0Jsb2NrQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6SGVhdG1hcENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJHcm91cGVkQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBOZ2JUb29sdGlwTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIFBiZHNEYXRhdml6UGllQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TGluZUNvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekdhdWdlQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6U3BhcmtsaW5lQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU3RhY2tlZENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpek1ldHJpY0Jsb2NrQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6SGVhdG1hcENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJHcm91cGVkQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBvbmVudFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRhdml6TW9kdWxlIHt9XG4iXX0=