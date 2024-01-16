export function notFound(res, msg) {
  return res.status(404).json({
    msg,
    error: true,
  });
}

export const a = 'a';
