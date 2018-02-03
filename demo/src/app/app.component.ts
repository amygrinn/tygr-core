import { Component } from '@angular/core';

import { Store } from '@tygr/core';

const test = 'hello';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private store: Store) {
    console.log(store.getState());
  }
}
