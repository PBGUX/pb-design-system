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
                styles: [".sbl-circ{animation:rotate 1.5s linear infinite;border-radius:50%;border-style:solid;border-top:solid rgba(0,0,0,0);border-width:6px;color:var(--primary);display:inline-block;height:48px;position:relative;width:48px}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}"]
            },] }
];
PbdsProgressSpinnerComponent.propDecorators = {
    size: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2RhMDU3Y28vRGVza3RvcC9Db2RlL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9zcmMvIiwic291cmNlcyI6WyJsaWIvcHJvZ3Jlc3Mtc3Bpbm5lci9wcm9ncmVzcy1zcGlubmVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQWtCakQsTUFBTSxPQUFPLDRCQUE0Qjs7O1lBaEJ4QyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsUUFBUSxFQUFFOzs7Ozs7Ozs7OztHQVdUOzthQUVGOzs7bUJBRUUsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1wcm9ncmVzcy1zcGlubmVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3BhbiByb2xlPVwiYWxlcnRcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIj5cbiAgICAgIDxzcGFuXG4gICAgICAgIGNsYXNzPVwic2JsLWNpcmNcIlxuICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwic2l6ZVwiXG4gICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwic2l6ZVwiXG4gICAgICAgIFtzdHlsZS5ib3JkZXItd2lkdGgucHhdPVwic2l6ZSAvIDhcIlxuICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPkxvYWRpbmc8L3NwYW4+XG4gICAgPC9zcGFuPlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi9wcm9ncmVzcy1zcGlubmVyLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGJkc1Byb2dyZXNzU3Bpbm5lckNvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHNpemU6IG51bWJlcjtcbn1cbiJdfQ==