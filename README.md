# Project Name

This is a Medical AI advisor app, built solely for cloudflare's AI hackthon. 

To run this project you must also run https://github.com/sanjaysekaren/summarize-dataSources-ai-models.git as it has all the code related to API.

## Installation

To run set up and run the project, follow these steps:

1. Run the frontend

```bash
git clone https://github.com/sbbeez/cloudflare-hackathon.git

cd cloudflare-hackthon

npm i

npm run dev
```

1. Run the Backend (API developed in workers AI)
  - Make sure to set your own Env variables in .dev.vars file: - ACCESS_KEY_ID = - SECRET_ACCESS_KEY = - ACCOUNT_ID = - VECTORIZE_INDEX
  - Create an R2 bucket in cloudflare (it is also s3 compatible) - BucketName should be 'cf-hackathon-ai'
```bash
git clone https://github.com/sanjaysekaren/summarize-dataSources-ai-models.git

cd summarize-dataSources-ai-models

npm i

npm run dev
```

Note: the API url used in the client app is hard-coded, so you have to update it to localhost:port.