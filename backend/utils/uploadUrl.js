function getFileUrl(req, file) {
  if (!file) return undefined;
  const forwardedProto = req.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const requestBase = `${forwardedProto || req.protocol}://${req.get('host')}`;
  const configuredBase = process.env.PUBLIC_API_URL;
  const publicBase = configuredBase && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(configuredBase)
    ? configuredBase
    : requestBase;
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
