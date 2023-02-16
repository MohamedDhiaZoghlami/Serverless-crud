import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda"
import { getCompanies } from "../data/company"

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const companies = await getCompanies()
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            companies
        })
    }

    return response
}