import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { Company, updateCompany } from "../data/company"

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const { category } = JSON.parse(event.body)
    const { name } = event.pathParameters
    await updateCompany(name, category)
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message:"success update"
        })
    }

    return response
}