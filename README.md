# Cara (Campus Accessibility & Routing Application)
## A mobile application aimed at providing accessible mapping and related services for college campuses
#### If you are looking for the cara API then go here https://github.com/milorue/cara_api
#### Note to maintainer: 
##### You will need your own google & stitch api keys in files named apiKey.js & credentials.js respectively

##### Docs: https://cara-docs.herokuapp.com/
---

### FAQ
1. **What is Cara?**
* Cara is a mobile application aimed at providing accessibility and hazard reporting to college campuses as well as providing a platform for 
community and accessibility services to better support individuals with physical and mental disabilities.
2. **How does it work?**
* Cara utilizes a crowd sourced data set of current permanent and temporary obstacles combined with satellite and OSM street data to
attempt to create an accurate map on which routing and alerts can be rendered upon.
3. **Do I need an account to utilize Cara?**
* Although some features like community access will be limited without an account you can still choose to login as an anonymous user through the 
guest login. As a guest you can still utilize Cara's maps, routes, news feed, alerts, and more.
4. **My route was inaccurate or didn't plot a route at all why?**
* Cara is in an extremely beta state and many of the kinks, bugs, and features are undergoing iteration. If you run into any issues feel free to report them to the issues
 section of this repo.
 5. **I'm experiencing app layout issues help!?**
 * The application is currently in active development and some formats may not be supported (ex: iPhone 3/4, Note 6, etc) feel free to notify me via the issues section on
  formats that aren't currently supported or have issues
 6. **What technologies does this application utilize?**
 * This app is built primarily using React Native and JavaScript ES6 on the frontend. Much of
---
### Tech Stack
#### Front-end Stack:
* React Native CLI
* Expo CLI
* React Native Paper
* ReactJS
* React-Native-Maps

#### Database Stack:
* MongoDB
* MongoDB Stitch
* PostgreSQL GIS

#### Backend Stack:
* PHP
* Flask/Django
* Python
* OSM SDK
* OSMNX & NETWORKX


