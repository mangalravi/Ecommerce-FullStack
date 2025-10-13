import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import slugify from "slugify"

dotenv.config()
const uri = process.env.MONGODB_URL
const client = new MongoClient(uri)

async function run() {
  try {
    await client.connect()
    const database = client.db("test") // use your DB name
    const collection = database.collection("products") // use your collection name

    // Find products without slug
    const products = await collection.find({ slug: { $exists: false } }).toArray()

    console.log(`Found ${products.length} products without slug`)

    for (let product of products) {
      const slug = slugify(product.title, { lower: true, strict: true })
      await collection.updateOne(
        { _id: product._id },
        { $set: { slug } }
      )
      console.log(`Updated slug for: ${product.title} -> ${slug}`)
    }

    console.log("All products updated with slug")
  } catch (err) {
    console.error(err)
  } finally {
    await client.close()
  }
}

run()
