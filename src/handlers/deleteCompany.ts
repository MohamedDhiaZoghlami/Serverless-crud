import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { Company, deleteCompany } from "../data/company"

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const { name } = event.pathParameters
    await deleteCompany(name)
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message:"success delete"
        })
    }

    return response
}