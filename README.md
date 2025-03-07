# Freshchat Sample API

This project is a sample API for managing flight bookings using AWS Lambda, DynamoDB, and the Serverless Framework.

## Prerequisites

Ensure you have the following installed:

* Node.js (for running JavaScript code)

* AWS CLI (configured with necessary permissions)

* Terraform (for infrastructure management)

* Serverless Framework (for deploying the Lambda function)

## Setup

1. Install Dependencies

    ```bash
    npm install
    ```

2. Setting Up Environment Variables

    Create a .env file in the project root and define your variables:

    ```json
    APP_NAME="your-unique-app-name"
    SERVICE_NAME="freshchat-sample-api"
    AWS_REGION="ap-southeast-2"
    LAMBDA_EXECUTION_ROLE_ARN="from terraform output"
    DYNAMODB_TABLE_NAME="from terraform output"
    ```

3. Setting Up terraform.tfvars

    Create a terraform.tfvars file and configure the necessary variables:

    ```json
    app_name = "your-unique-app-name"
    aws_region = "ap-southeast-2"
    lambda_execution_role_arn = "from terraform output"
    dynamodb_table_name = "from terraform output"
    ```

## Deployment

### Using Serverless Framework

   1. Deploy the Serverless Application:

      ```bash
      npx serverless deploy
      ```

   2. Using Terraform

      Initialize Terraform:

      ```bash
      terraform init
      ```

   3. Apply Terraform Configuration:

      ```bash
      terraform apply
      ```

## API Endpoints

### Create Booking

* URL: /booking

* Method: POST

* Handler: index.createBooking

### Get Booking

* URL: /booking/{id}

* Method: GET

* Handler: index.getBooking

### Update Booking

* URL: /booking/{id}

* Method: PUT

* Handler: index.updateBooking

### Delete Booking

* URL: /booking/{id}

* Method: DELETE

* Handler: index.deleteBooking

## License

This project is licensed under the ISC License.
