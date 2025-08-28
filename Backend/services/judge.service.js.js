const axios = require('axios');

const JUDGE0_URL = process.env.JUDGE0_URL; // e.g. RapidAPI Judge0 endpoint
const RAPIDAPI_KEY = process.env.JUDGE0_RAPIDAPI_KEY || ''; // optional

async function runSubmission(code, language, stdin){
  // language should correspond to judge0 language id or name
  // This function creates a submission and polls for result (simple implementation)
  const headers = {};
  if(RAPIDAPI_KEY){
    headers['X-RapidAPI-Key'] = RAPIDAPI_KEY;
    headers['X-RapidAPI-Host'] = new URL(JUDGE0_URL).hostname;
  }
  try{
    // create submission
    const createRes = await axios.post(JUDGE0_URL, {
      source_code: code,
      language_id: language, // or language name depending on endpoint
      stdin: stdin,
      expected_output: undefined,
      cpu_time_limit: "2"
    }, { headers });

    const token = createRes.data.token || createRes.data; // API shapes vary
    // poll
    for(let i=0;i<20;i++){
      await new Promise(r=>setTimeout(r, 700));
      const res = await axios.get(`${JUDGE0_URL}/${token}`, { headers });
      if(res.data.status && res.data.status.id > 2){
        // finished
        return res.data;
      }
    }
    return { error: 'timeout' };
  } catch(err){
    console.error('judge0 error', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { runSubmission };
