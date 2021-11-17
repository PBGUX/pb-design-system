import { Component, Input } from '@angular/core';
export class PbdsProgressSpinnerComponent {
}
PbdsProgressSpinnerComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-progress-spinner',
                template: `
    <span role="alert" aria-live="assertive">
      <span
        class="sbl-circ"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.border-width.px]="size / 8"
        aria-hidden="true"
      ></span>
      <span class="sr-only">Loading</span>
    </span>
  `,
                styles: [".sbl-circ{height:48px;width:48px;color:var(--primary);position:relative;display:inline-block;border-width:6px;border-style:solid;border-radius:50%;border-top-color:transparent;animation:rotate 1.5s linear infinite}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"]
            },] }
];
PbdsProgressSpinnerComponent.propDecorators = {
    size: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL3Byb2dyZXNzLXNwaW5uZXIvcHJvZ3Jlc3Mtc3Bpbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFrQmpELE1BQU0sT0FBTyw0QkFBNEI7OztZQWhCeEMsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7R0FXVDs7YUFFRjs7O21CQUVFLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtcHJvZ3Jlc3Mtc3Bpbm5lcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHNwYW4gcm9sZT1cImFsZXJ0XCIgYXJpYS1saXZlPVwiYXNzZXJ0aXZlXCI+XG4gICAgICA8c3BhblxuICAgICAgICBjbGFzcz1cInNibC1jaXJjXCJcbiAgICAgICAgW3N0eWxlLndpZHRoLnB4XT1cInNpemVcIlxuICAgICAgICBbc3R5bGUuaGVpZ2h0LnB4XT1cInNpemVcIlxuICAgICAgICBbc3R5bGUuYm9yZGVyLXdpZHRoLnB4XT1cInNpemUgLyA4XCJcbiAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgID48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2FkaW5nPC9zcGFuPlxuICAgIDwvc3Bhbj5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJy4vcHJvZ3Jlc3Mtc3Bpbm5lci5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNQcm9ncmVzc1NwaW5uZXJDb21wb25lbnQge1xuICBASW5wdXQoKVxuICBzaXplOiBudW1iZXI7XG59XG4iXX0=