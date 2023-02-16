import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda"
import { getCompany } from "../data/company"

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const { name } = event.pathParameters
    console.log(name);
    const company = await getCompany(name)
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            company
        })
    }

    return response
}