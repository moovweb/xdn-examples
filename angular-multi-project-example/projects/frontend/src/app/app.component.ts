import { Component } from '@angular/core';
import { HelloWorldService } from 'projects/tools/src/lib/hello-world.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(helloWorld: HelloWorldService) {
    this.title = helloWorld.message;
  }
}
