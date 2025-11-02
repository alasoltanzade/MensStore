import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { appConfig } from './app/app.config';
import { HttpClientModule } from "@angular/common/http";


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    HttpClientModule,
    ...appConfig.providers,
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
