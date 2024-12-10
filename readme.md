<div align="center">
  <h1>Better UI</h1>
  <h4>Make Acode look better with the Better UI plugin. This tool lets you change how Acode looks and works.</h4>
</div>

## What it does

- **Changes the look**: Makes Acode look nicer.
- **Pick what you want**: Turn on or off changes for different parts of Acode.
- **Add your own style**: You can add your own CSS to make Acode look how you want.

## How to use it

After you add it:

1. Go to Acode settings.
2. Find the "Plugins" part.
3. Click on "Better UI" to change its settings.

In the settings, you can:
- Turn different changes on or off
- Add your own CSS
- Change settings for different parts of Acode

## Help make it better

We'd love your help to make Better UI even better! If you want to help:

1. Clone our repo from [github](https://github.com/NezitX/better-ui).
2. Make the changes you want.
3. Open a new pull request in [github](https://github.com/NezitX/better-ui).

Please make sure your changes work well and fit with how the rest of the code looks.

## License

This project uses the MIT [License](./license).

## Need help?

If something's not working or you have questions, let us know on our [GitHub page](https://github.com/NezitX/better-ui).

## API `(^1.3.0)`

You can use **Better UI** now which provide some useful tools for you.
start by call it:
```js
const BetterUI = acode.require("@better/ui");
```

> Constants

```js
/**
 * Returns the path to the UI folder.
 * @type {string}
 */
BetterUI.UiPath

/**
 * Returns the path to the custom CSS file.
 * @type {string}
 */
BetterUI.CustomCssPath

/**
 * Provides an array of available UI types in the plugin.
 * @type {string[]}
 */
BetterUI.UiTypes
```

> Methods

```js
/**
 * Reset the ui for active types and custom css file.
 * @return {Promise<void>}
 */
await BetterUI.resetUi();
```