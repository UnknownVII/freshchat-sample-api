import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export const createBooking = async (event) => {
  const { user, email, flightNumber, date } = JSON.parse(event.body);

  if (!user || !email || !flightNumber || !date) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing required fields: user, email, flightNumber, date",
      }),
    };
  }

  const bookingId = uuidv4();

  const params = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: { bookingId, user, email, flightNumber, date },
  });

  await client.send(params);

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Booking created", bookingId }),
  };
};
