import AWS from "aws-sdk";
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

export const updateBooking = async (event) => {
  const { id } = event.pathParameters;
  const { flightNumber, date, email } = JSON.parse(event.body);

  const checkParams = {
    TableName: TABLE_NAME,
    Key: { bookingId: id },
  };

  const existingBooking = await dynamoDB.get(checkParams).promise();

  if (!existingBooking.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "Booking not found. It may have been deleted.",
      }),
    };
  }

  // Step 2: Build UpdateExpression dynamically
  let updateExpression = "SET";
  let expressionAttributeValues = {};
  let expressionAttributeNames = {};

  if (flightNumber) {
    updateExpression += " flightNumber = :f,";
    expressionAttributeValues[":f"] = flightNumber;
  }
  if (date) {
    updateExpression += " #d = :d,";
    expressionAttributeValues[":d"] = date;
    expressionAttributeNames["#d"] = "date"; // Alias for reserved keyword
  }
  if (email) {
    updateExpression += " email = :e,";
    expressionAttributeValues[":e"] = email;
  }

  // Remove trailing comma
  updateExpression = updateExpression.replace(/,$/, "");

  const updateParams = {
    TableName: TABLE_NAME,
    Key: { bookingId: id },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: Object.keys(expressionAttributeNames).length
      ? expressionAttributeNames
      : undefined,
    ReturnValues: "UPDATED_NEW",
  };

  const result = await dynamoDB.update(updateParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Booking updated", result }),
  };
};
