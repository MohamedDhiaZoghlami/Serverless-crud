import { DynamoDB } from "aws-sdk";
import { Item } from "./base";
import { getClient } from "./client"

export class Company extends Item {
    name: string
    category: string
    nbrEmp: number

    constructor(name: string, category?: string, nbrEmp?: number) {
        super()
        this.name = name
        this.category = category || ""
        this.nbrEmp = nbrEmp || 0
    }

    static fromItem(item?: DynamoDB.AttributeMap): Company {
        if (!item) throw new Error("No item!")
        return new Company(item.name.S, item.category.S, Number(item.nbrEmp.N))
    }

    get pk(): string {
        return "COM"
    }

    get sk(): string {
        return `COM#${this.name}`
    }

    toItem(): Record<string, unknown> {
        return {
            ...this.keys(),
            name: { S: this.name },
            category: { S: this.category },
            nbrEmp: { N: this.nbrEmp.toString() },
        }
    }
}

export const createCompany = async (company: Company): Promise<Company> => {
    const client = getClient();
    try {
        await client
            .putItem({
                TableName: process.env.TABLE_NAME,
                Item: company.toItem(),
                ConditionExpression: "attribute_not_exists(PK)"
            })
            .promise()
        return company
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getCompany = async (name: string): Promise<Company> => {
    const client = getClient()
    const company = new Company(name, "", 0)
    console.log(company);
    console.log(company.keys());
    try {
        const resp = await client
            .getItem({
                TableName: process.env.TABLE_NAME,
                Key: company.keys()
            })
            .promise();
        console.log(resp);
        return Company.fromItem(resp.Item)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getCompanies = async (): Promise<Company[]> => {
    const client = getClient()
    let Companies: Company[];
    try {
        const resp = await client
            .query({
                TableName: process.env.TABLE_NAME,
                KeyConditionExpression: "PK = :pk",
                ExpressionAttributeValues: {
                    ":pk": {S: "COM" }
                },
                ScanIndexForward: false
            })
            .promise();
        console.log(resp);
        Companies = resp.Items.map(item => Company.fromItem(item));
        console.log(Companies)
        return Companies;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const updateCompany = async (name: string,category: string): Promise<String> => {
    const client = getClient();
    const company = new Company(name, category)
    try {
        const resp = await client
            .updateItem({
                TableName: process.env.TABLE_NAME,
                Key: company.keys(),
                UpdateExpression: 'set category = :newcategory',
                ExpressionAttributeValues: {
                    ":newcategory": {S: category}
                }
            })
            .promise();
        console.log(resp);
        return "update successfull"
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const deleteCompany = async (name: string): Promise<String> => {
    const client = getClient();
    const company = new Company(name)
    try {
        const resp = await client
            .deleteItem({
                TableName: process.env.TABLE_NAME,
                Key: company.keys(),
            })
            .promise();
        console.log(resp);
        return "delete successfull"
    } catch (error) {
        console.log(error)
        throw error
    }
}