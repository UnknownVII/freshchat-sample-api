output "lambda_role_arn" {
  value = aws_iam_role.lambda_exec_role.arn
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.bookings.name
}
