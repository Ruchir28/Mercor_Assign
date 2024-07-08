// setup a express app
import express from "express";
import prisma from "./prismaclient";
import dotenv from "dotenv";
import { parseUserInput } from "./extract-filters";

dotenv.config();

const app = express();

// enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.use(express.json());

app.post("/api/extract-filters", async (req, res) => {
  const { searchString } = req.body;

  try {
    const input = await parseUserInput(searchString);
    console.log(input);
    return res.json(input);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/search", async (req, res) => {
  let { page, skills, companies, educational_institutes, major } = req.body;

  // convert to lower case and remove and empty spacing
  skills = skills.map((skill: string) => skill.trim().toLowerCase());
  companies = companies.map((company: string) => company.trim().toLowerCase());
  educational_institutes = educational_institutes.map(
    (educational_institute: string) =>
      educational_institute.trim().toLowerCase()
  );
  major = major.map((mjr: string) => mjr.trim().toLowerCase());

  console.log(req.body);

  const take = 6;
  const skip = (page - 1) * take;

  console.log(`
    page: ${page},
    skills: ${skills},
    companies: ${companies},
    educational_institutes: ${educational_institutes},
    major: ${major}
    `);

  try {
    const users = await prisma.mercorUsers.findMany({
      where: {
        AND: [
          companies && companies.length > 0
            ? {
                UserResume: {
                  WorkExperience: {
                    some: {
                      company: {
                        in: companies,
                      },
                    },
                  },
                },
              }
            : {},
          skills && skills.length > 0
            ? {
                MercorUserSkills: {
                  some: {
                    Skills: {
                      skillName: {
                        in: skills,
                      },
                    },
                  },
                },
              }
            : {},
          major && major.length > 0
            ? {
                UserResume: {
                  Education: {
                    some: {
                      major: {
                        in: major,
                      },
                    },
                  },
                },
              }
            : {},
          educational_institutes && educational_institutes.length > 0
            ? {
                UserResume: {
                  Education: {
                    some: {
                      school: {
                        in: educational_institutes,
                      },
                    },
                  },
                },
              }
            : {},
        ],
      },
      include: {
        MercorUserSkills: {
          include: {
            Skills: true,
          },
        },
      },
      take: take,
      skip: skip,
    });

    return res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.mercorUsers.findUnique({
      where: {
        userId: userId,
      },
      include: {
        MercorUserSkills: {
          include: {
            Skills: true,
          },
        },
        UserResume: {
          include: {
            WorkExperience: true,
            Education: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
