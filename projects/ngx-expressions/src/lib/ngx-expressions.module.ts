import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NgxExpressionsService } from './services/ngx-expressions.service';

@NgModule({
  imports: [],
  exports: [],
  providers: [
    NgxExpressionsService
  ]
})
export class NgxExpressionsModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxExpressionsModule
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: NgxExpressionsModule) {
    if (parentModule) {
      throw new Error(
        'NgxExpressionsModule is already loaded. Import it in the root module only');
    }
  }
}
