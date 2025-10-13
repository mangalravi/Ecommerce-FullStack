import { MongoClient } from "mongodb"
import fs from "fs"
import dotenv from "dotenv"
import slugify from "slugify" // <-- install with npm i slugify

dotenv.config()

const uri = process.env.MONGODB_URL
const client = new MongoClient(uri)

async function run() {
  try {
    await client.connect()
    const database = client.db("test")
    const collection = database.collection("products")

    // Read JSON file
    const data = JSON.parse(fs.readFileSync("./ProductList.json", "utf-8"))

    // Add slug to each product
    const dataWithSlugs = data.map((product) => ({
      ...product,
      slug: slugify(product.title, { lower: true, strict: true }),
    }))

    // Insert data
    const result = await collection.insertMany(dataWithSlugs)
    console.log(`${result.insertedCount} documents inserted successfully`)
  } catch (err) {
    console.error("Error inserting documents:", err)
  } finally {
    await client.close()
  }
}

run()
