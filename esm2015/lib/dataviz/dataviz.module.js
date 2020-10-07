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
import { DatavizBubbleMapComponent } from './dataviz-bubble-map.component';
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
                    DatavizBubbleMapComponent,
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
                    DatavizBubbleMapComponent,
                    PbdsDatavizMetricIndicatorComponent,
                    PbdsDatavizHeatmapComponent,
                    PbdsDatavizChoroplethMapComponent,
                    PbdsDatavizBarGroupedComponent,
                    PbdsDatavizBarSingleHorizontalComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXZpei5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3N0MDE2bG8vZ2l0aHViL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9zcmMvIiwic291cmNlcyI6WyJsaWIvZGF0YXZpei9kYXRhdml6Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUU5RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM5RSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNqRixPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNuRixPQUFPLEVBQUUsbUNBQW1DLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RixPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNqRixPQUFPLEVBQUUsdUNBQXVDLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQW1DcEcsTUFBTSxPQUFPLGlCQUFpQjs7O1lBakM3QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLHVCQUF1QjtvQkFDdkIsdUJBQXVCO29CQUN2Qix3QkFBd0I7b0JBQ3hCLHlCQUF5QjtvQkFDekIsNkJBQTZCO29CQUM3Qiw4QkFBOEI7b0JBQzlCLCtCQUErQjtvQkFDL0IseUJBQXlCO29CQUN6QixtQ0FBbUM7b0JBQ25DLDJCQUEyQjtvQkFDM0IsaUNBQWlDO29CQUNqQyw4QkFBOEI7b0JBQzlCLHVDQUF1QztpQkFDeEM7Z0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDO2dCQUN6QyxPQUFPLEVBQUU7b0JBQ1AsdUJBQXVCO29CQUN2Qix1QkFBdUI7b0JBQ3ZCLHdCQUF3QjtvQkFDeEIseUJBQXlCO29CQUN6Qiw2QkFBNkI7b0JBQzdCLDhCQUE4QjtvQkFDOUIsK0JBQStCO29CQUMvQix5QkFBeUI7b0JBQ3pCLG1DQUFtQztvQkFDbkMsMkJBQTJCO29CQUMzQixpQ0FBaUM7b0JBQ2pDLDhCQUE4QjtvQkFDOUIsdUNBQXVDO2lCQUN4QzthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IE5nYlRvb2x0aXBNb2R1bGUgfSBmcm9tICdAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcCc7XG5cbmltcG9ydCB7IFBiZHNEYXRhdml6UGllQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LXBpZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXJDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekxpbmVDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotbGluZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpHYXVnZUNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1nYXVnZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpTcGFya2xpbmVDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotc3BhcmtsaW5lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekJhclN0YWNrZWRDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotYmFyLXN0YWNrZWQuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6TWV0cmljQmxvY2tDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotbWV0cmljLWJsb2NrLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpek1ldHJpY0luZGljYXRvckNvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1tZXRyaWMtaW5kaWNhdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWJ1YmJsZS1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6SGVhdG1hcENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1oZWF0bWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQgfSBmcm9tICcuL2RhdGF2aXotY2hvcm9wbGV0aC1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IFBiZHNEYXRhdml6QmFyR3JvdXBlZENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXZpei1iYXItZ3JvdXBlZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGJkc0RhdGF2aXpCYXJTaW5nbGVIb3Jpem9udGFsQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdml6LWJhci1zaW5nbGUtaG9yaXpvbnRhbC5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBQYmRzRGF0YXZpelBpZUNvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekJhckNvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekxpbmVDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpHYXVnZUNvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpelNwYXJrbGluZUNvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekJhclN0YWNrZWRDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpNZXRyaWNCbG9ja0NvbXBvbmVudCxcbiAgICBEYXRhdml6QnViYmxlTWFwQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TWV0cmljSW5kaWNhdG9yQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6SGVhdG1hcENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekNob3JvcGxldGhNYXBDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJHcm91cGVkQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU2luZ2xlSG9yaXpvbnRhbENvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBOZ2JUb29sdGlwTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIFBiZHNEYXRhdml6UGllQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6TGluZUNvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekdhdWdlQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6U3BhcmtsaW5lQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6QmFyU3RhY2tlZENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpek1ldHJpY0Jsb2NrQ29tcG9uZW50LFxuICAgIERhdGF2aXpCdWJibGVNYXBDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpNZXRyaWNJbmRpY2F0b3JDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpIZWF0bWFwQ29tcG9uZW50LFxuICAgIFBiZHNEYXRhdml6Q2hvcm9wbGV0aE1hcENvbXBvbmVudCxcbiAgICBQYmRzRGF0YXZpekJhckdyb3VwZWRDb21wb25lbnQsXG4gICAgUGJkc0RhdGF2aXpCYXJTaW5nbGVIb3Jpem9udGFsQ29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgUGJkc0RhdGF2aXpNb2R1bGUge31cbiJdfQ==