// setup a express app
import express from 'express';
import prisma from './prismaclient';

const app = express();

// enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/users', async (req, res) => {

    try {

        const pageNumber = parseInt(req.query.page as string) || 1;

        const take = 10;
        
        const skip = (pageNumber - 1) * take;

        const users = await prisma.mercorUsers.findMany(
            {
                include: {
                    MercorUserSkills: {
                        select: {
                            Skills: {
                                select: {
                                    skillName: true,
                                    skillId: true,
                                    skillValue: true,
                                }
                            }
                        }
                    }
                },
                where: {
                    OR: [
                        { partTime: true },
                        { fullTime: true }
                    ]
                },
                take: take,
                skip: skip,
            }
        );

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

