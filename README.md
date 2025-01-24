# umi-plugin-tailwindcss-v2

> This plugin is only valid for umijs 3.x，Umi4 has built-in support for Tailwindcss and is no longer needed for new projects. I have locked the tailwind version to 3.4.0 for now to prevent breaking changes.
> [umi4 tailwind-css doc](https://umijs.org/docs/guides/generator#tailwind-css-%E9%85%8D%E7%BD%AE%E7%94%9F%E6%88%90%E5%99%A8)

[中文文档](https://github.com/dewfall123/umi-plugin-tailwindcss/blob/master/README.CN.md)

## Install

Using npm:

```bash
$ npm install umi-plugin-tailwindcss-v2 -D
```

or using yarn:

```bash
$ yarn add umi-plugin-tailwindcss-v2 -D
```

## Setup

`tailwindCssFilePath?: string`.

tailwind.css file path, can be missing。

```ts
// .umirc.ts
// eg
...
tailwindcss: {
  tailwindCssFilePath?: '@/tailwind.css',
  tailwindConfigFilePath?: 'tailwind-custom.config.js' // Default value: tailwindConfigFilePath || join(process.env.APP_ROOT || api.cwd, 'tailwind.config.js'),
},
...
```

## Explain

This plugin do the [following things](https://tailwindcss.com/docs/installation) to support tailwind in umi。

1. Add `tailwindcss` dependencies auto.
   For 4.x: defauts to the latest version `tailwindcss@latest`
   For 3.x: defauts to the compat version[@tailwindcss/postcss7-compat](https://tailwindcss.com/docs/installation#post-css-7-compatibility-build), because of umi doesn't support postcss8 now）。

   You can also install the specific version of tailwindcss. If `tailwindcss` exist in `devDependencies`, plugin will use it, otherwise plugin will use `@tailwindcss/postcss7-compat`。

2. Add Tailwind to your CSS。If `tailwindCssFilePath` setting exist, plugin will import this css file automatically. If not exist, will create a temporary file, and import it.
3. If `tailwind.config.js` not exist at `tailwindConfigFilePath`, it will create one。
4. Add postcss plugin in umi。
