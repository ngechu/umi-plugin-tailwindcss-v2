import { IApi, IConfig } from 'umi';
import { tailwindConfigJS, tailwindcssContent } from './constants';
import { dirname, join } from 'path';
import fs from 'fs';

function getTailwindConfigFilePath(api: IApi) {
  const { tailwindConfigFilePath } = api.userConfig.tailwindcss || {};

  const configFile =
    tailwindConfigFilePath ||
    join(process.env.APP_ROOT || api.cwd, 'tailwind.config.js');

  return configFile;
}

export default (api: IApi) => {
  api.describe({
    key: 'tailwindcss',
    config: {
      schema(joi) {
        return joi.object({
          tailwindCssFilePath: joi.string(),
          tailwindConfigFilePath: joi.string(),
        });
      },
    },
  });

  // 添加postcss-plugin配置
  api.modifyConfig((config: IConfig) => {
    const configPath = getTailwindConfigFilePath(api);
    // fix #8
    if (!fs.existsSync(configPath)) {
      console.log('generate tailwind.config.js.');
      fs.writeFileSync(configPath, tailwindConfigJS, 'utf8');
    }

    const tailwindcssPackageName = '@tailwindcss/postcss';

    const autoprefixerOptions = api.userConfig.autoprefixer;

    config.extraPostCSSPlugins = [
      ...(config.extraPostCSSPlugins || []),
      (() => {
        try {
          // Attempt to use the new PostCSS plugin
          return require(tailwindcssPackageName)({ config: configPath });
        } catch (e) {
          console.warn(
            '`@tailwindcss/postcss` not found. Falling back to the older `tailwindcss` PostCSS plugin. Please consider updating your TailwindCSS setup.'
          );
          // Fall back to the older TailwindCSS plugin
          return require('tailwindcss')({ config: configPath });
        }
      })(),
      require('autoprefixer')(autoprefixerOptions),
    ];

    return config;
  });

  // 添加依赖
  api.addProjectFirstLibraries(() => [
    {
      name: 'tailwindcss',
      path: dirname(require.resolve('tailwindcss')),
    },
  ]);

  // 添加文件
  api.onGenerateFiles(() => {
    const { tailwindCssFilePath } = api.userConfig.tailwindcss || {};
    if (!tailwindCssFilePath) {
      api.writeTmpFile({
        path: `tailwind.css`,
        content: tailwindcssContent,
      });
    }

    // 添加tailwind.config.js
    const ConfigFile = getTailwindConfigFilePath(api);
    if (!fs.existsSync(ConfigFile)) {
      console.log('generate tailwind.config.js.');
      fs.writeFileSync(ConfigFile, tailwindConfigJS, 'utf8');
    }
  });

  api.addEntryImportsAhead(() => {
    const { tailwindCssFilePath } = api.userConfig.tailwindcss || {};
    return {
      source: tailwindCssFilePath || './tailwind.css',
    };
  });
};
