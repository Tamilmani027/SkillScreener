import * as compareService from '../services/compareService.js';

export async function compare(req, res, next) {
  try {
    const db = req.app.locals.db;
    const result = await compareService.processFiles(req.files, db);
    res.json({ result });
  } catch (err) {
    next(err);
  }
}
