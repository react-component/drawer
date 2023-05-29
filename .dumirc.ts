import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  alias: {
    'rc-drawer$': path.resolve('src'),
    'rc-drawer/es': path.resolve('src'),
  },
  mfsu: false,
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: 'Image',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
});
