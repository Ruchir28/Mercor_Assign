// Home.tsx
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import UserCard from "./components/UserCard";
import LoadingCard from "./components/LoadingCard";
import {
  usersState,
  pageCountState,
  hasMoreState,
  loadingState,
  errorState,
  filtersState,
  lastFetchedFiltersState,
  UserWithSkills,
} from "./recoilstate";
import { config } from "./config";

const Home = () => {
  const [users, setUsers] = useRecoilState(usersState);
  const [pageCount, setPageCount] = useRecoilState(pageCountState);
  const [hasMore, setHasMore] = useRecoilState(hasMoreState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [error, setError] = useRecoilState(errorState);
  const filters = useRecoilValue(filtersState);
  const [lastFetchedFilters, setLastFetchedFilters] = useRecoilState(lastFetchedFiltersState);

  const fetchUsers = useCallback(async (isNewSearch: boolean = false) => {
    if ((!hasMore && !isNewSearch) || loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.SERVER_URL}/api/search`, {
        method: "POST",
        body: JSON.stringify({
          page: isNewSearch ? "1" : pageCount.toString(),
          ...filters
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");

      const newUsers = await response.json() as UserWithSkills[];

      setUsers((prevUsers) =>
        isNewSearch ? newUsers : [...prevUsers, ...newUsers]
      );
      setPageCount((prevCount) => (isNewSearch ? 2 : prevCount + 1));
      setHasMore(newUsers.length > 0);
      setLastFetchedFilters(filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [filters, pageCount, hasMore, loading, setUsers, setPageCount, setHasMore, setError, setLoading, setLastFetchedFilters]);

  useEffect(() => {
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(lastFetchedFilters);
    if (filtersChanged || users.length === 0) {
      fetchUsers(true);
    }
  }, [filters, lastFetchedFilters, users.length, fetchUsers]);

  return (
    <div className="min-h-screen w-100 flex flex-col items-center justify-center bg-gray-100">
      <div className="w-100 flex flex-wrap justify-center">
        {users.map((user) => (
          <UserCard key={user.userId} user={user} />
        ))}
        {loading && Array(10).fill(0).map((_, index) => <LoadingCard key={index} />)}
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      <div className="flex justify-center">
        {!loading && !error && hasMore && (
          <button
            onClick={() => fetchUsers(false)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;