const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const cors=require('cors');

var apiKey="";
var apiSecret="";

const app = express();
const port = 3000;

corsPolicy={
  origin: "http://localhost:3001",
  methods: ['get','post'],
  optionsSuccessStatus: 200
}

app.use(cors(corsPolicy));

// Set up AWS credentials and create a Comprehend instance
AWS.config.update({
  region: 'us-east-1',  // Replace with your AWS region
  accessKeyId: apiKey,  // Replace with your AWS access key
  secretAccessKey: apiSecret  // Replace with your AWS secret key
});

const comprehend = new AWS.Comprehend();

app.use(bodyParser.json());

app.post('/analyze-sentiment', (req, res) => {
  const { text } = req.body;

  const params = {
    LanguageCode: 'en',  // Replace with the appropriate language code
    Text: text
  };

  comprehend.detectSentiment(params, (err, data) => {
    if (err) {
      console.error('Error analyzing sentiment:', err);
      res.status(500).json({ error: 'Error analyzing sentiment' });
    } else {
      console.log('Sentiment analysis result:', data);
      res.json({ sentiment: data.Sentiment });
    }
  });
});

app.post('/detect-dominant-language', (req, res) => {
  const { text } = req.body;

  const params = {
    Text: text
  };

  comprehend.detectDominantLanguage(params, (err, data) => {
    if (err) {
      console.error('Error analyzing Language:', err);
      res.status(500).json({ error: 'Error analyzing Language' });
    } else {
      console.log('Language analysis result:', data);
      res.json({ language: data.Languages[0].LanguageCode });
    }
  });
});

app.post('/detect-entities', (req, res) => {
  const { text } = req.body;

  const params = {
    LanguageCode: 'en',
    Text: text
  };

  comprehend.detectEntities(params, (err, data) => {
    if (err) {
      console.error('Error analyzing Entities:', err);
      res.status(500).json({ error: 'Error analyzing Entities' });
    } else {
      console.log('Entities analysis result:', data);
      data=data.Entities;
      var data1=[]
      data.forEach(element => {
        data1.push({'Type':element.Type,'Text':element.Text});
      });
      res.json({ entities: data1 });
    }
  });
});

app.post('/detect-syntax', (req, res) => {
  const { text } = req.body;

  const params = {
    LanguageCode: 'en',
    Text: text
  };

  comprehend.detectSyntax(params, (err, data) => {
    if (err) {
      console.error('Error analyzing Syntax:', err);
      res.status(500).json({ error: 'Error analyzing Syntax' });
    } else {
      console.log('Entities analysis Syntax:', data);
      data=data.SyntaxTokens;
      var data1=[]
      data.forEach(element => {
        data1.push({'Text':element.Text,'PartOfSpeech':element.PartOfSpeech,'TokenId':element.TokenId});
      });
      res.json({ syntax: data1 });
    }
  });
});

app.post('/detect-pii', (req, res) => {
  const { text } = req.body;

  const params = {
    LanguageCode: 'en',
    Text: text
  };

  comprehend.detectPiiEntities(params, (err, data) => {
    if (err) {
      console.error('Error analyzing PII:', err);
      res.status(500).json({ error: 'Error analyzing PII' });
    } else {
      console.log('PII analysis:', data);
      data=data.Entities
      var data1=[]
      data.forEach(element => {
        data1.push({'Entity':element.Entity,'Type':element.Type});
      });
      res.json({ pii: data1 });
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
