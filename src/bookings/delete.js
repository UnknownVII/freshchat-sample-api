import AWS from "aws-sdk";
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

export const deleteBooking = async (event) => {
  const { id } = event.pathParameters;

  const checkParams = {
    TableName: TABLE_NAME,
    Key: { bookingId: id },
  };

  const existingBooking = await dynamoDB.get(checkParams).promise();

  if (!existingBooking.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Booking not found. Nothing to delete." }),
    };
  }

  const deleteParams = {
    TableName: TABLE_NAME,
    Key: { bookingId: id },
  };

  await dynamoDB.delete(deleteParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Booking deleted successfully" }),
  };
};
