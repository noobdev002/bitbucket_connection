require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/bitbucket-webhook', async (req, res) => {
  try {
    await axios.post(
      `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/dispatches`,
      {
        event_type: 'bitbucket_event',
        client_payload: { data: req.body }
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_PAT}`,
          Accept: 'application/vnd.github.everest-preview+json'
        }
      }
    );

    res.status(200).send('✅ GitHub workflow triggered');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Failed to trigger GitHub');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
