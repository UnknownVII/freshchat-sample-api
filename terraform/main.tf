resource "aws_iam_role" "lambda_exec_role" {
  name = "${var.app_name}-lambda-role-${var.stage}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_dynamodb_table" "bookings" {
  name         = "${var.app_name}-flight-bookings-${var.stage}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "bookingId"

  attribute {
    name = "bookingId"
    type = "S"
  }

  tags = {
    Name = "${var.app_name}-flight-bookings-${var.stage}-table"
  }
}

resource "aws_iam_role_policy_attachment" "lambda_logs_access" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

# IAM Policy for DynamoDB CRUD Access
resource "aws_iam_policy" "lambda_dynamodb_policy" {
  name        = "${var.app_name}-dynamodb-policy-${var.stage}"
  description = "IAM policy for Lambda to perform CRUD operations on DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ],
        Resource = "arn:aws:dynamodb:${var.region}:*:table/${var.app_name}-flight-bookings-${var.stage}"
      }
    ]
  })
}

# Attach the IAM Policy to the Lambda Execution Role
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_attach" {
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
  role       = aws_iam_role.lambda_exec_role.name
}


