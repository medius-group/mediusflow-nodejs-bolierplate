# MediusFlow Node.js Boilerplate
The goal of this project is to provide a boilerplate for rapid prototyping of standalone MediusFlow apps. The boilerplate will help with:
* Authentication of users 
* Basic design and frontend components

Prerequisites
---------------
* [Node.js]

[node.js]: https://nodejs.org/en/


Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Clone repository
git clone https://github.com/medius-group/mediusflow-nodejs-bolierplate.git myMediusFlowApp

# Change directory
cd myMediusFlowApp

# Install dependencies
npm install

# Start your application
npm start
```

Setup authentication with MediusFlow
---------------
1. Login to your MediusFlow instance.
2. Go to Administration > ClentApplications (https://cloud.mediusflow.com/[tenantId]/#Administration/Medius.Core.Entities.Api.ClientApplication)
3. Add a new application 
* Name: Name of your application (not important)
* Authentication Flow: Authorization Code Flow
* Redirect URI: http://localhost:3000/auth/mediusflow/callback
4. Copy Client Id and Client Secret and put in the .env file in your project.