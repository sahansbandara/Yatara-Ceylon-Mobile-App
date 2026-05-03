const slugify = require('slugify');
const { z } = require('zod');
const Package = require('../models/Package');
const { mergeUploadedImage } = require('../utils/uploadUrl');

const packageSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  summary: z.string().min(3),
  fullDescription: z.string().optional(),
  duration: z.string().min(1),
  durationDays: z.coerce.number().min(1).optional(),
  type: z.enum(['journey', 'transfer']).default('journey'),
  style: z.string().optional(),
  priceMin: z.coerce.number().min(0),
  priceMax: z.coerce.number().min(0),
  images: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  inclusions: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.coerce.boolean().optional(),
});

function normalizeBody(body) {
  const data = { ...body };
  for (const key of ['images', 'highlights', 'inclusions', 'tags']) {
    if (typeof data[key] === 'string') {
      data[key] = data[key].split(',').map((item) => item.trim()).filter(Boolean);
    }
  }
  return data;
}

async function listPackages(req, res, next) {
  try {
    const query = { isDeleted: { $ne: true } };
    if (req.query.public === 'true') query.isPublished = true;
    const packages = await Package.find(query).sort({ createdAt: -1 });
    res.json({ data: packages });
  } catch (error) {
    next(error);
  }
}

async function getPackage(req, res, next) {
  try {
    const item = await Package.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!item) return res.status(404).json({ error: 'Package not found' });
    res.json({ data: item });
  } catch (error) {
    next(error);
  }
}

async function createPackage(req, res, next) {
  try {
    const parsed = packageSchema.parse(normalizeBody(req.body));
    const payload = mergeUploadedImage(req, {
      ...parsed,
      slug: parsed.slug || slugify(parsed.title, { lower: true, strict: true }),
    });
    const item = await Package.create(payload);
    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
}

async function updatePackage(req, res, next) {
  try {
    const parsed = packageSchema.partial().parse(normalizeBody(req.body));
    const payload = mergeUploadedImage(req, parsed);
    if (payload.title && !payload.slug) {
      payload.slug = slugify(payload.title, { lower: true, strict: true });
    }
    const item = await Package.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      payload,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Package not found' });
    res.json({ data: item });
  } catch (error) {
    next(error);
  }
}

async function deletePackage(req, res, next) {
  try {
    const item = await Package.findByIdAndUpdate(req.params.id, { isDeleted: true, deletedAt: new Date() }, { new: true });
    if (!item) return res.status(404).json({ error: 'Package not found' });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { listPackages, getPackage, createPackage, updatePackage, deletePackage };
