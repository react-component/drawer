import { defineConfig } from 'dumi';
import path from 'path';

const basePath = process.env.GH_PAGES ? '/drawer/' : '/';
const publicPath = basePath;

export default defineConfig({
  outputPath: 'docs-dist',
  base: basePath,
  publicPath,
  alias: {
    'rc-drawer$': path.resolve('src'),
    'rc-drawer/es': path.resolve('src'),
  },
  mfsu: false,
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: 'Drawer',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
});
