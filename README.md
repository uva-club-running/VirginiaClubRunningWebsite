# Virginia Club Running's Website
[Club Running](https://virginia.clubrunning.org) is an athletic CIO at the University of Virginia. 

This repository contains the source code for our website, [virginia.clubrunning.org](http://virginia.clubrunning.org/).
## Project structure

```
.
├── dist - build output
├── src - source files that are preprocessed/compiled at build time
│    └── Components
│        ├── Admin - components for the admin dashboard
│        ├── Community - components for the Community page
│        ├── Contact - components for the Contact page
│        ├── Home - components for the landing page
│        ├── Join - components for the Join page
│        ├── Meets - components for the Meets page
│        ├── Philanthropy - components for the Philanthropy page
│        ├── Records - components for the Records page
│        └── App.jsx, firebase.jsx, ... - routes and database stuff mainly
│       
├── public
│     └── assets
│         ├── profiles - contact photos for current exec
│         └── logos, other misc. photos, etc. - maybe organize this more in the future
│
└── config files and such

```

`./dist/` contains the site build output. It is deliberately excluded in `.gitignore`, so it won't be present when you clone the repository.
`./dist/` will be created and filled with built content when you [build](#building) the site.

`./src/` contains the .jsx source files for the project and all React componenets.

`./public/` contains all assets used in the website

## Prerequisites
- [NodeJS](https://nodejs.org/en/) installed on your machine.
- [Git](https://docs.github.com/en/get-started/quickstart/set-up-git) installed on your machine and authenticated with GitHub.

## Quickstart

To get up and running:

1. [Clone this repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) somewhere convenient.
2. Navigate to the project root and install project dependencies:
```
npm install
```
3. Start the development server:
```
npm run dev
```
4. Open `http://localhost:5173` in your web browser. As you make changes, the site rebuilds automatically.

## Building
To build the site and exit:
```
npm run build
```

This executes the `build` task defined in [package.json](./package.json).
The build output is placed in `./dist/`.

## Publishing changes
1. Add and commit your changes ([guide](https://github.com/git-guides#make-change-and-make-a-commit)):
```bash
# assuming you are on the `master` branch, a descriptive name commit message is preferred!
git add .
git commit -m "Updated website"
```
2. Push your changes
```bash
# push changes to `origin/master`
git push
```

Changes are automatically [deployed](#deploying) on push.

## Deploying
### Hosting background
We use NIRCA's [free web hosting service](https://clubrunning.org/web.php) for member organizations.

We do not have direct control over the web host. Insetad, NIRCA gives us a username/password to login to an SFTP server. (Webmasters: the transition document has the login, reach out to your predecessor if it cannot be found there)

### GitHub Actions

This repository is configured using GitHub Actions to automatically rebuild and deploy (via FTP) the website whenever you push to the `main` branch.

Every time new commits are pushed to `main`, the pipeline will be triggered. In principle, this means you should never have to access the SFTP server directly. Make your changes locally, push them to Git, and let GitHub actions handle the rest.

## Contributing
Club Running's [Webmaster](https://virginia.clubrunning.org/contact) is ultimately responsible for maintaining the site, but contributions from others are certainly welcome.

Contributors should follow [this guide](https://docs.github.com/en/get-started/quickstart/contributing-to-projects) to make their changes.
