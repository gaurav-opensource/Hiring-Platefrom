const crypto = require('crypto');

// simple sha256 hash of code text
function codeHash(code){
  return crypto.createHash('sha256').update(code || '').digest('hex');
}

// naive token-set similarity (Jaccard) - good quick flag for very similar code
function jaccardSimilarity(a, b){
  if(!a || !b) return 0;
  const ta = new Set(a.split(/\W+/).filter(Boolean));
  const tb = new Set(b.split(/\W+/).filter(Boolean));
  const inter = [...ta].filter(x=>tb.has(x)).length;
  const uni = new Set([...ta, ...tb]).size;
  if(uni === 0) return 0;
  return inter / uni;
}

module.exports = { codeHash, jaccardSimilarity };
