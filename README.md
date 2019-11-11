# Design System 6.0.0

Your npm version must be at least 6.11.2, please check by running `npm -v`.
Your node version must at least be 10.16.0, please check by running `node -v`.

## Local Development

Run `npm run setup` from the root folder which installs node modules for each of the root, client, library and server folders.

Use the following commands to install dependencies for each as needed:

```
npm run setup:root
npm run setup:client
npm run setup:server
npm run setup:library
```

After all installs complete, from the root folder run:

```
npm start
```

This will start the server at port `:8083`, the client at `:8082`. Open your browser to `http://localhost:8083`.

**Note:** You may need to delete the `package-lock.json` file and reinstall node modules if there is an error running the app.

## Local Library Development

Run `npm run setup` if dependencies have not been installed.

In one run `npm run watch:library`. This will rebuild the library and watch files for changes, then rebuild.

In another terminal run `npm start:library` from the root of the project. This will start the client without AOT and increase the poll time to 10 seconds.

**Note:** be sure to run `npm run build` or `npm start` from the root folder to enusre there are no build errors since the library development does not use AOT compilation.

## Local Build

Install node-sass and bestzip globally:

```
npm install -g node-sass
npm install -g bestzip
```

Run `npm run build` from the root folder. This will compile:

- the Angular app into `./deploy/public` (including all assets: fonts, images, etc)
- run tsc to compile the typescript files into `./deploy`
- create `./deploy/deploy.zip`

## Design System Distribution

Install postcss-cli globally:

```
npm install postcss-cli
```

To build the distributable files for the `pb-design-system`, run:

```
npm run package
```

This will compile:

- the design system scss files to `./package/dist/css/designsystem.css`
- copy the fonts to `./package/dist/fonts`
- copy the mixins and variables scss files to `./package/sass`
- build the library and copy files to the root of `./package`
