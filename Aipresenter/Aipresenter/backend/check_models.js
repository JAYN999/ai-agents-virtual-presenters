import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testModel() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const modelsToTest = ["gemini-2.0-flash", "gemini-flash-latest"];

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello!");
            console.log(`Success with ${modelName}:`, result.response.text());
            return; // Exit after first success
        } catch (error) {
            console.error(`Error with ${modelName}:`, error.message);
        }
    }
}

testModel();
