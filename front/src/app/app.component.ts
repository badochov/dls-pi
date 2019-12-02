import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import {
  transition,
  style,
  query,
  animateChild,
  animate,
  group,
  trigger,
} from "@angular/animations";

export const slideInAnimation = trigger("routeAnimations", [
  transition("* => *", [
    query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
      optional: true,
    }),
    group([
      query(
        ":enter",
        [
          style({ transform: "translateX(-100%)" }),
          animate("0.5s ease-in-out", style({ transform: "translateX(0%)" })),
        ],
        { optional: true }
      ),
      query(
        ":leave",
        [
          style({ transform: "translateX(0%)" }),
          animate("0.5s ease-in-out", style({ transform: "translateX(100%)" })),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [
    slideInAnimation,
    // animation triggers go here
  ],
})
export class AppComponent {
  title = "Automat do butelek";

  public prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData["animation"]
    );
  }
}
