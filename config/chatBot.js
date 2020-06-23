const chatBot = require('dialogflow');
const uuid = require('uuid');

/**
 * Send a query to the chatBot agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(projectId, message, jsonFile) {
    // A unique identifier for the given session
    let sessionId = uuid.v4();

    // Create a new session
    let sessionClient = new chatBot.SessionsClient({
        credentials:{client_email:jsonFile.client_email, private_key: jsonFile.private_key},
        email:'vr54640@gmail.com',
        projectId:jsonFile.project_id
    });
    let sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the chatBot agent
                text: message,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    let responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');

    return responses[0].queryResult;
  //   console.log(`  Query: ${result.queryText}`);
  //   console.log(`  Response: ${result.fulfillmentText}`);
   //  if (result.intent) {
   //      console.log(`  Intent: ${result.intent.displayName}`);
   //  } else {
   //      console.log(`  No intent matched.`);
   //  }

}
module.exports = {f2: runSample};
