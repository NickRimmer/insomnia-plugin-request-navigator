import { build } from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
// import postcssParentSelector from 'postcss-parent-selector'

build({
  bundle: true,
  entryPoints: ['./src/index.ts'],
  external: [
    'react',
    'react-dom',
    'uuid',
    'nedb',
  ],
  format: 'cjs',
  outfile: './dist/index.js',
  // watch: Boolean(process.env.ESBUILD_WATCH),
  platform: 'node',
  plugins: [
    sassPlugin({
      type: 'style',
      // async transform(source, resolveDir, fileName) {
      //   // do not wrap index styles
      //   if (fileName.toLowerCase().endsWith(".css")) return source;

      //   const { css } = await postcss([
      //     postcssParentSelector({ selector: '.insomnia-plugin-free-sync' })
      //   ]).process(source, { from: undefined })

      //   return css
      // }
    }),
  ],
})
