import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment, Router } from '@angular/router';

import { LoginComponent } from './components/login';
import { HomeComponent } from './components/home';
import { SettingsComponent } from './components/settings';
import { AboutComponent } from './components/about';
import { AuthGuard } from './guards';
import { RouteHistoryService } from './services';
import { SubscriptionAddComponent } from './components/subscription-add';
import { PublishMessageComponent } from './components/publish-message';

const routes: Routes = [
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
    { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'subscribe/:topicArn', component: SubscriptionAddComponent, canActivate: [AuthGuard] },
    { path: 'publish/:topicArn', component: PublishMessageComponent, canActivate: [AuthGuard] },

    // otherwise redirect to main page
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes, { scrollPositionRestoration: 'enabled' } // may become default in angular in the future
            // { enableTracing: true } // <-- debugging purposes only
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
    constructor(private route: Router, private history: RouteHistoryService) {}
}

