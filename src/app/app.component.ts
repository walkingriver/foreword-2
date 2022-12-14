import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { polyfill } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,

  ) {
    this.platform.ready().then(() => {
      this.initializeApp();
    });
  }

  initializeApp() {
    // this.statusBar.styleDefault();
    // this.statusBar.overlaysWebView(false);
    // this.statusBar.backgroundColorByHexString('#C1A172');
    // this.splashScreen.hide();

    // Test via a getter in the options object to see if the passive property is accessed
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supportsPassive = true;
        }
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
    } catch (e) { }

    // workaround to make scroll prevent work in iOS Safari > 10
    try {
      const isPolyfill = polyfill({
        // use this to make use of the scroll behaviour
        dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
      });
      console.log('IsPolyFill: ', isPolyfill);
      if (supportsPassive) {
        window.addEventListener('touchmove', () => { }, { passive: false });
      } else {
        window.addEventListener('touchmove', () => { });
      }
    } catch (e) { }
  }
}
