# Raccoony! ![Raccoony logo][logo]

**Now with 100% more WebExtension goodness™**

A web extension for Firefox and Chrome that adds shiny new features (like automatic downloading) to art sites. 
Inspired by the [FurAffinity Extender](https://andrewneo.github.io/faextender/) and [Inkbunny Downloader](http://www.humbird0.com/#/addons/inkbunny_downloader) Firefox addons.

See the [official website][website] for announcements.

This README is a work in progress.

## Features
- Download submissions from art sites
- Open all submissions in a gallery/notifications in tabs (with a timed delay)
- Show pictures in a "full-screen" view that covers the entire page (and optionally enter this view automatically)
- Hotkey support for downloading, opening in tabs and fullscreen
- Supported sites: deviantArt, e621, Eka's Portal (contributed by Eupeptic), FurAffinity, Furry Network, HicceArs, InkBunny, Patreon, Shorpy.com (contributed by Eupeptic), SoFurry, and Weasyl.

See the TODO list below for more planned features.

## Download & Install

For **Firefox** - download the XPI for the latest release on the **[releases page](https://github.com/Simon-Tesla/RaccoonyWebEx/releases)**

**Please note:** While Raccoony is known to work on Firefox for Android, support is not guaranteed and I don't test it. Raccoony does not currently work on the new Firefox for Android (based on Fenix and currently in beta) [due to lack of support for third-party extensions](https://blog.mozilla.org/addons/2020/02/11/faq-for-extension-support-in-new-firefox-for-android/).

For **Chrome** - install from the **[Chrome Web Store](https://chrome.google.com/webstore/detail/raccoony-webextension/ejcbnfgeiphhnkmpjggnkkhnbefihelh)** 

## Building
- Install [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/) (usually comes with Node.js)
- Run `npm install -g typescript gulp`
- Run `npm install`
- Run `gulp build`

Extension files and build output will be in `dist/`.

## Changelog

See the [changelog](https://github.com/Simon-Tesla/RaccoonyWebEx/blob/master/CHANGELOG.md)

## Contributing

See the [CONTRIBUTING](https://github.com/Simon-Tesla/RaccoonyWebEx/blob/master/CONTRIBUTING.md) document. This is a free-time project for me, and I have no need for monetary donations, so I'm looking for coding help more than anything else. 

## Credits
- The Raccoony logo ![Raccoony logo][logo] is ©[ScruffKerfluff][logoauthor], and is only licenced to be distributed as-is with unmodified Raccoony source code or binary distributions. It **MAY NOT** be distributed or modified under any other circumstances or used for profit.
- Eupeptic for contributing the Eka's Portal and Shorpy plugins.
- AndrewNeo for his excellent [FurAffinity Extender](https://andrewneo.github.io/faextender-chrome/) extension. Some code in Raccoony is based on his work, and I consulted his code for some of the WebExtension API handling and for setting up the gulp build framework.

[logo]: https://github.com/Simon-Tesla/RaccoonyWebEx/raw/master/src/icon-64.png
[logoauthor]: https://twitter.com/ScruffKerfluff
[website]: http://raccoony.thornvalley.com
