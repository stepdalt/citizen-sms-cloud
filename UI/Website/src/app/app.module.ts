// Angular and rxjs modules
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientXsrfModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

// Material and other external libraries
import { LayoutModule } from '@angular/cdk/layout';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

import { AdalService, AdalGuard, AdalInterceptor } from 'adal-angular4';

// Add custom modules here
// COC Core
// TODO: other auth modules include COCssoService, COCOauth2Service, COCOpenTokenService - add/remove as needed
// TODO: add COCEMFModule if using authenticated EMF logging
import {
    COCCoreModule, COCAuthModule, COCLoggingModule, COCACFModule, COCIdentityProvider,
    COCBasicAuthService, COCErrorHandler, COCBrowserWarnings
} from './coc-core';
// import { COCStorageProviders, ICOCStorageProvider } from './coc-core';
// import { COCIndexedDBProvider } from './coc-core';
// import { COCLocalStorageProvider } from './coc-core';

// App Template Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertBannerComponent, AlertBannerContentComponent } from './components/alert-banner';
import { FooterComponent } from './components/footer';
import { HeaderComponent } from './components/header';
import { HomeComponent } from './components/home';
import { LoginComponent } from './components/login';
import { SettingsComponent } from './components/settings';
import { AboutComponent } from './components/about';
import { SpinnerComponent } from './components/spinner';
import { ConfirmComponent } from './components/confirm';
import { ConnectivityBannerComponent } from './components/connectivity-banner';
// App Specific Components

// Directives, Guards, Models, Pipes, Resolvers, Services and Shared
import {
    StopPropagationDirective, TrimInputDirective,
    SafeBackButtonDirective,
    FormValidationDirective,
    ControlValidationDirective
} from './directives';
import { AuthGuard, CanDeactivateGuard } from './guards';
import { Globals } from './models';

import { RouteHistoryService, TopicService, SubscriptionService, UserService } from './services';
import { Helpers } from './shared';

// Add environment here
import { environment } from '../environments/environment';
import { TopicListComponent } from './components/topic-list';
import { SubscriptionAddComponent } from './components/subscription-add';
import { SubscriptionListComponent } from './components/subscription-list';
import { PublishMessageComponent } from './components/publish-message';

// TODO: Add if using Open Token - otherwise remove
// import { CookieService } from 'ngx-cookie-service';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientXsrfModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        ScrollingModule,
        MatInputModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatCardModule,
        MatToolbarModule,
        MatExpansionModule,
        MatListModule,
        MatTabsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.pwa }),  // TODO: remove if PWA is not needed
        // capture browser generated warnings
        COCBrowserWarnings,
        // load COC Core modules
        COCCoreModule,
        COCAuthModule,
        // COCEMFModule,
        COCLoggingModule,
        COCACFModule
    ],
    exports: [
        MatInputModule,
        MatSlideToggleModule,
        MatSnackBarModule
    ],
    declarations: [
        AppComponent,
        FooterComponent,
        HeaderComponent,
        LoginComponent,
        SpinnerComponent,
        ConfirmComponent,
        ConnectivityBannerComponent,
        SettingsComponent,
        HomeComponent,
        TopicListComponent,
        SubscriptionAddComponent,
        SubscriptionListComponent,
        PublishMessageComponent,
        AboutComponent,
        AlertBannerComponent,
        AlertBannerContentComponent,
        StopPropagationDirective,
        SafeBackButtonDirective,
        TrimInputDirective,
        FormValidationDirective,
        ControlValidationDirective,
    ],
    providers: [
        AuthGuard,
        CanDeactivateGuard,
        Helpers,
        Globals,
        AlertBannerComponent,
        AlertBannerContentComponent,
        RouteHistoryService,
        UserService,
        TopicService,
        SubscriptionService,
        AdalService,
        AdalGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AdalInterceptor,
            multi: true
        },
        // log global errors
        {
            provide: ErrorHandler,
            useClass: COCErrorHandler
        },
        // sign in with Basic Auth
        {
            provide: COCIdentityProvider,
            useClass: COCBasicAuthService,
            multi: true
        },
        
    ],
    // dynamic components
    entryComponents: [
        SpinnerComponent,
        ConfirmComponent,
        AlertBannerComponent,
        AlertBannerContentComponent
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor() { }
}
