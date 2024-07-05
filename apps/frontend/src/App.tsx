import { useCallback, useEffect, useState } from "react";
import UserCard from "./components/UserCard";
import { Prisma} from "@prisma/client"
import LoadingCard from "./components/LoadingCard";


export type UserWithSkills = Prisma.MercorUsersGetPayload<{
  include: {
    MercorUserSkills: {
      include: {
        Skills: true
      }
    }
  }
}>

function App() {

  const [users, setUsers] = useState<UserWithSkills[]>();
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const fetchUsers = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/users?page=${pageCount}`);
      if (!response.ok) throw new Error('Failed to fetch users');

      const newUsers = await response.json() as UserWithSkills[];
      
      setUsers(prevUsers => {
        return prevUsers ? [...prevUsers, ...newUsers] : newUsers;
      });
      setPageCount(prevCount => prevCount + 1);
      
      if (newUsers.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [pageCount, hasMore, loading]);


  useEffect(() => {
    fetch(`http://localhost:3000/users?page=${pageCount}`).then(async (res) => {
      const users = await res.json();
      setUsers((prevUsers)=> {
        return prevUsers ? [...prevUsers, ...users] : users;
      });
      setLoading(false);
    });
  }, [pageCount]);


  return (
    <div className="min-h-screen w-100 flex flex-wrap items-center justify-center bg-gray-100">
      <div className="w-100 flex flex-wrap">
        {loading
        ? Array(10).fill(0).map((_, index) => <LoadingCard key={index} />)
        : users?.map(user => <UserCard key={user.userId} user={user} />)
        }
        </div>
        <div  className="flex justify-center">
        {!loading && !error && hasMore && (
        <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Load More
        </button>
        )}
        </div>
    </div>
  );

}

export default App
