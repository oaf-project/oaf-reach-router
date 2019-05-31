import { History, HistoryLocation } from "@reach/router";
import {
  createOafRouter,
  defaultSettings as oafRoutingDefaultSettings,
  LocationKey,
  RouterSettings,
} from "oaf-routing";

// tslint:disable: no-expression-statement

export { RouterSettings } from "oaf-routing";

export const defaultSettings: RouterSettings<HistoryLocation> = {
  ...oafRoutingDefaultSettings,
  repairFocus: false, // Reach Router handles focus itself, so we let it do its thing by default.
};

// HACK we need a way to track where focus and scroll were left on the first loaded page
// but we won't have an entry in history for this initial page, so we just make up a key.
const orInitialKey = (key: LocationKey | undefined): LocationKey =>
  key !== undefined ? key : "initial";

export const wrapHistory = (
  history: History,
  settingsOverrides?: Partial<RouterSettings<HistoryLocation>>,
): (() => void) => {
  const settings: RouterSettings<HistoryLocation> = {
    ...defaultSettings,
    ...settingsOverrides,
  };

  const oafRouter = createOafRouter(settings, location => location.hash);

  const initialLocation = history.location;

  // HACK: We use setTimeout to give React a chance to render before we repair focus.
  setTimeout(() => {
    oafRouter.handleFirstPageLoad(initialLocation);
  }, settings.renderTimeout);

  // tslint:disable-next-line: no-let
  let previousLocation = initialLocation;

  const unlisten = history.listen(({ location, action }) => {
    // We're the first subscribed listener, so the DOM won't have been updated yet.
    oafRouter.handleLocationWillChange(
      orInitialKey(previousLocation.key),
      orInitialKey(location.key),
      action,
    );

    // HACK: We use setTimeout to give React a chance to render before we repair focus.
    setTimeout(() => {
      oafRouter.handleLocationChanged(
        previousLocation,
        location,
        orInitialKey(location.key),
        action,
      );
    }, settings.renderTimeout);

    previousLocation = location;
  });

  return () => {
    oafRouter.resetAutoScrollRestoration();
    unlisten();
  };
};
