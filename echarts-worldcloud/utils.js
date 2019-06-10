module.exports = {
  isMultiColor(o) {
    return o && o.style && (o.value || (o.from && o.to));
  },
  adjustEchartConfig(o) {
    if (this.isMultiColor(o)) {
      if (o.style === 'single') {
        return o.value;
      }
    }
  }
};

