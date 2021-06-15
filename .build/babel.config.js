module.exports = {
  presets: [
    ['@babel/preset-env', { debug: true }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { regenerator: true }],
  ],
}
