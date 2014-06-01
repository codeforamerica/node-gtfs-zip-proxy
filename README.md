# gtfs-zip-proxy

Publish a Google Transit-compatible GTFS feed from files hosted on Github. This makes it easy for your local transit agency to publish transit schedule and routing information using free tools and in a public manner. Hosting GTFS data on Github lets anyone make pull requests with corrections and improvements, and also view historic changes in schedule and other information.


## Overview

Create a new Github repository to host your GTFS data, e.g. https://github.com/jden/gtfs. Then run this proxy service pointing to that repository. Finally, log into the Google Transit partner dashboard and set up automatic data acquisition pointed to the URL for this proxy service. Voila!

## installation

Requirements: Node.js 0.10 or newer

Clone this repository and then
```console
$ npm install
$ npm start
```
The following environment variables must be set:

- `PORT` the port number to listen on
- `REPO` the github username/repo to pull data from, eg `jden/gtfs`



## running the tests

From package root:

    $ npm install
    $ npm test


## contributors

- jden <jason@denizac.org>


## license

ISC. (c) MMXIV Code for America. See LICENSE.md
