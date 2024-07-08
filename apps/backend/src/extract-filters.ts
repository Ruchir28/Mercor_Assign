import dotenv from "dotenv";
import { Prisma } from "@prisma/client";

import {
  FunctionCallingMode,
  FunctionDeclaration,
  FunctionDeclarationSchemaType,
  GoogleGenerativeAI,
} from "@google/generative-ai";



dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ParsedInput {
  companies?: string[];
  skills?: string[];
  major?: string[];
  educational_institutes?: string[];
}

export const parseUserInput = async (input: string): Promise<ParsedInput> => {
  try {
    const matchBestCandidates: FunctionDeclaration = {
      name: "extractCandidatesInfo",
      description:
        "Converts a given text into structured information about candidates",
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          companies: {
            type: FunctionDeclarationSchemaType.STRING,
            description:
              "The companies candidates have worked at seperated by ,",
          },
          skills: {
            type: FunctionDeclarationSchemaType.STRING,
            description: "The skills candidates have seperated by ,",
          },
          major: {
            type: FunctionDeclarationSchemaType.STRING,
            description:
              "The major candidates should have studied seperated by for example: Computer Science ,",
          },
          educational_institutes: {
            type: FunctionDeclarationSchemaType.STRING,
            description:
              "The educational institute candidates have attended seperated by ,",
          },
        },
        required: ["companies", "skills", "major", "educational_institutes"],
      },
    };

    const tools = [
      {
        functionDeclarations: [matchBestCandidates],
      },
    ];

    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash-latest", tools },
      { apiVersion: "v1beta" }
    );

    const prompt = {
      role: "user",
      parts: [
        {
          text: `NOTE: Please provide empty string in case the parameter isn't present and don't provide any extra information, The candidates information is : ${input}`,
        },
      ],
    };

    const result = await model.generateContent({
      contents: [prompt],
    });
    const response = result.response;
    console.dir(response, { depth: null });

    if (response && response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content.parts.length === 0) {
        throw new Error("No parts");
      }
      const fc = content.parts[0].functionCall;
      if (!fc) {
        throw new Error("No function call");
      }
      const { name, args } = fc;
      if (name !== "extractCandidatesInfo") {
        throw new Error("Invalid function call");
      }

      //@ts-ignore
      const { companies, skills, major, educational_institutes } = args;

      // split the comma separated values into an array
      const companiesArray = companies.length == 0 ? [] : companies.split(",");
      const skillsArray = skills.length == 0 ? [] : skills.split(",");
      const majorArray = major.length == 0 ? [] : major.split(",");
      const educationalInstituteArray =
        educational_institutes.length == 0
          ? []
          : educational_institutes.split(",");
      // return the parsed input
      return {
        companies: companiesArray,
        skills: skillsArray,
        major: majorArray,
        educational_institutes: educationalInstituteArray,
      } as ParsedInput;
    } else {
      throw new Error("No candidates found");
    }
  } catch (error) {
    throw error;
  }
};
