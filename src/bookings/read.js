import AWS from "aws-sdk";
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

export const getBooking = async (event) => {
  const { id } = event.pathParameters;
  const params = {
    TableName: TABLE_NAME,
    Key: { bookingId: id },
  };

  const result = await dynamoDB.get(params).promise();
  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Booking not found" }),
    };
  }

  return { statusCode: 200, body: JSON.stringify(result.Item) };
};
