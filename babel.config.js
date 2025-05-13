module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Geçici olarak NativeWind kaldırıldı
    // plugins: ['nativewind/babel']
  };
}; 