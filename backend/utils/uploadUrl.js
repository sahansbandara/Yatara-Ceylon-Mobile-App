function getFileUrl(req, file) {
  if (!file) return undefined;
  const publicBase = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`;
  return `${publicBase.replace(/\/$/, '')}/uploads/${file.filename}`;
}

function mergeUploadedImage(req, payload, field = 'images') {
  const imageUrl = getFileUrl(req, req.file);
  if (!imageUrl) return payload;
  return {
    ...payload,
    [field]: [...(Array.isArray(payload[field]) ? payload[field] : []), imageUrl],
  };
}

module.exports = { getFileUrl, mergeUploadedImage };
