function fileExtension(filename, opts) {
  if (!opts) opts = {};
  if (!filename) return '';
  const ext = (/[^./\\]*$/.exec(filename) || [''])[0];
  return opts.preserveCase ? ext : ext.toLowerCase();
}

module.exports = fileExtension;
