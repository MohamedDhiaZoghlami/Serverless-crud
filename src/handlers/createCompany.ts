import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { Company, createCompany } from "../data/company"

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const {  name, category } = JSON.parse(event.body)
    const company = new Company(name, category, 0)
    await createCompany(company)
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            company
        })
    }

    return response
}