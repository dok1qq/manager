import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RoutingModule } from '../routing/routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { AngularFireStorageModule } from '@angular/fire/storage';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

	    // Firebase
	    AngularFireModule.initializeApp(environment.firebaseConfig),
	    AngularFireStorageModule,

	    // Routing
	    RoutingModule,
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
