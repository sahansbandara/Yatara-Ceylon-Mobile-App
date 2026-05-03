const slugify = require('slugify');
const { mergeUploadedImage } = require('../utils/uploadUrl');

function normalize(body, arrayFields = []) {
  const data = { ...body };
  for (const field of arrayFields) {
    if (typeof data[field] === 'string') {
      data[field] = data[field].split(',').map((item) => item.trim()).filter(Boolean);
    }
  }
  for (const [key, value] of Object.entries(data)) {
    if (value === 'true') data[key] = true;
    if (value === 'false') data[key] = false;
    if (['seats', 'luggage', 'dailyRate', 'priority'].includes(key) && value !== '') data[key] = Number(value);
  }
  return data;
}

function crudController(Model, options = {}) {
    const arrayFields = options.arrayFields || [];
    const schema = options.schema;

  return {
    async list(_req, res, next) {
      try {
        const data = await Model.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },

    async detail(req, res, next) {
      try {
        const item = await Model.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
        if (!item) return res.status(404).json({ error: `${options.name || 'Record'} not found` });
        res.json({ data: item });
      } catch (error) {
        next(error);
      }
    },

    async create(req, res, next) {
      try {
        let payload = normalize(req.body, arrayFields);
        if (schema) payload = schema.parse(payload);
        if (options.slugFrom && !payload.slug) {
          payload.slug = slugify(payload[options.slugFrom], { lower: true, strict: true });
        }
        payload = mergeUploadedImage(req, payload);
        const item = await Model.create(payload);
        res.status(201).json({ data: item });
      } catch (error) {
        next(error);
      }
    },

    async update(req, res, next) {
      try {
        let payload = normalize(req.body, arrayFields);
        if (schema) payload = schema.partial().parse(payload);
        if (options.slugFrom && payload[options.slugFrom] && !payload.slug) {
          payload.slug = slugify(payload[options.slugFrom], { lower: true, strict: true });
        }
        payload = mergeUploadedImage(req, payload);
        const item = await Model.findOneAndUpdate(
          { _id: req.params.id, isDeleted: { $ne: true } },
          payload,
          { new: true, runValidators: true }
        );
        if (!item) return res.status(404).json({ error: `${options.name || 'Record'} not found` });
        res.json({ data: item });
      } catch (error) {
        next(error);
      }
    },

    async remove(req, res, next) {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, { isDeleted: true, deletedAt: new Date() }, { new: true });
        if (!item) return res.status(404).json({ error: `${options.name || 'Record'} not found` });
        res.json({ success: true });
      } catch (error) {
        next(error);
      }
    },
  };
}

module.exports = crudController;
