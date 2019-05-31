[![Build Status](https://travis-ci.org/oaf-project/oaf-reach-router.svg?branch=master)](https://travis-ci.org/oaf-project/oaf-reach-router)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Foaf-project%2Foaf-reach-router%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/oaf-project/oaf-reach-router/badge.svg?targetFile=package.json)](https://snyk.io/test/github/oaf-project/oaf-reach-router?targetFile=package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/oaf-project/oaf-reach-router.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/npm/v/oaf-reach-router.svg)](https://www.npmjs.com/package/oaf-reach-router)

[![dependencies Status](https://david-dm.org/oaf-project/oaf-reach-router/status.svg)](https://david-dm.org/oaf-project/oaf-reach-router)
[![devDependencies Status](https://david-dm.org/oaf-project/oaf-reach-router/dev-status.svg)](https://david-dm.org/oaf-project/oaf-reach-router?type=dev)
[![peerDependencies Status](https://david-dm.org/oaf-project/oaf-reach-router/peer-status.svg)](https://david-dm.org/oaf-project/oaf-reach-router?type=peer)

# Oaf Reach Router

An accessible wrapper for [Reach Router](https://github.com/reach/router).

Documentation at https://oaf-project.github.io/oaf-reach-router/

## Features

* Reset scroll and focus after PUSH and REPLACE navigation
* Restore scroll and focus after POP navigation
* Set the page title after navigation
* Announce navigation to users of screen readers
* Hash fragment support

In lieu of more details, see [Oaf React Router](https://github.com/oaf-project/oaf-react-router/blob/master/README.md#features) for now. The features are basically the same.

## Installation

```sh
# yarn
yarn add oaf-reach-router

# npm
npm install oaf-reach-router
```

## Basic Usage

```diff
+ import { globalHistory } from "@reach/router";
+ import { wrapHistory } from "oaf-reach-router";

+ wrapHistory(history);

...
```

## Advanced Usage

```typescript
const history = createBrowserHistory();

const settings = {
  announcementsDivId: "announcements",
  primaryFocusTarget: "main h1, [role=main] h1",
  // This assumes you're setting the document title via some other means (e.g. React Helmet).
  // If you're not, you should return a unique and descriptive page title for each page
  // from this function and set `setPageTitle` to true.
  documentTitle: (location: Location) => document.title,
  // BYO localization
  navigationMessage: (title: string, location: Location, action: Action): string => `Navigated to ${title}.`,
  shouldHandleAction: (previousLocation: Location, nextLocation: Location, action: Action) => true,
  disableAutoScrollRestoration: true,
  announcePageNavigation: true,
  setPageTitle: false,
  handleHashFragment: true,
  // Set this to false if you are using HashRouter or MemoryRouter.
  restorePageStateOnPop: true,
  // Set this to true for smooth scrolling.
  // For browser compatibility you might want iamdustan's smoothscroll polyfill https://github.com/iamdustan/smoothscroll
  smoothScroll: false,
};

wrapHistory(history, settings);
```

### A note on focus outlines
You may see focus outlines around your `h1` elements (or elsewhere, per `primaryFocusTarget`) when using Oaf Reach Router.

You might be tempted to remove these focus outlines with something like the following:
```css
[tabindex="-1"]:focus {
  outline: 0 !important;
}
```

Don't do this! Focus outlines are important for accessibility. See for example:

* https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-visible.html
* https://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/F78
* http://www.outlinenone.com/

Note that [Bootstrap 4 unfortunately removes these focus outlines](https://github.com/twbs/bootstrap/issues/28425). If you use Bootstrap, you can restore them with [Oaf Bootstrap 4](https://github.com/oaf-project/oaf-bootstrap-4).

All that said, if you absolutely _must_ remove focus outlines (stubborn client, stubborn boss, stubborn designer, whatever), consider using the [`:focus-visible` polyfill](https://github.com/WICG/focus-visible) so focus outlines are only hidden from mouse users, _not_ keyboard users.

## See also
* [Reach Router Accessibility](https://reach.tech/router/accessibility)
* [Oaf Routing](https://github.com/oaf-project/oaf-routing)
* [Oaf Side Effects](https://github.com/oaf-project/oaf-side-effects)
* [React-axe](https://github.com/dequelabs/react-axe)
* [React Accessibility](https://reactjs.org/docs/accessibility.html)
