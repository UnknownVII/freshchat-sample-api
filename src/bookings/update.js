import AWS from "aws-sdk";
import { FlightStatus } from "../utils/enums/flightStatus";
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

export const updateBooking = async (event) => {
  const { id } = event.pathParameters;
  const { flightNumber, date, email, flightStatus } = JSON.parse(event.body);

  // Check if the booking exists
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

  // Validate flightStatus if provided
  if (flightStatus && !Object.values(FlightStatus).includes(flightStatus)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `Invalid flight status. Allowed values: ${Object.values(
          FlightStatus
        ).join(", ")}`,
      }),
    };
  }

  // Build UpdateExpression dynamically
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
  if (flightStatus) {
    updateExpression += " flightStatus = :fs,";
    expressionAttributeValues[":fs"] = flightStatus;
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
