import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IoAdd } from "react-icons/io5";
import { ChevronLeft, ChevronRight, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Toaster, toast } from "react-hot-toast";

const UserManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [userName, setUserName] = useState("");
  const [userIsLoading, setUserIsLoading] = useState(false);
  const [lastPage, setLastPage] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const handleNextPage = () => {
    searchParams.set("page", Number(searchParams.get("page")) + 1);

    setSearchParams(searchParams);
  };

  const handlePreviousPage = () => {
    searchParams.set("page", Number(searchParams.get("page")) - 1);

    setSearchParams(searchParams);
  };

  const searchUser = () => {
    if (userName) {
      searchParams.set("search", userName);

      setSearchParams(searchParams);
    } else {
      searchParams.delete("search");

      setSearchParams(searchParams);
    }
  };

  const fetchUsers = async () => {
    try {
      setUserIsLoading(true);

      const userResponse = await axiosInstance.get("/users", {
        params: {
          _per_page: 5,
          _page: Number(searchParams.get("page")),
          fullname: searchParams.get("search"),
        },
      });

      setHasNextPage(Boolean(userResponse.data.next));
      setUsers(userResponse.data.data);
      setLastPage(userResponse.data.last);
    } catch (err) {
      console.log(err);
    } finally {
      setUserIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    const deletePromises = selectedUserIds.map((userId) => {
      return axiosInstance.delete("/users/" + userId);
    });

    try {
      await Promise.all(deletePromises);
      toast.success("User deleted successfully");
      fetchUsers();
      setSelectedUserIds([]);
    } catch (err) {
      toast.error("Failed to delete user. Please try again");
      console.log(err);
    }
  };

  const handleOnCheckedUser = (userId, checked) => {
    if (checked) {
      const prevSelectedUserIds = [...selectedUserIds];
      prevSelectedUserIds.push(userId);

      setSelectedUserIds(prevSelectedUserIds);
    } else {
      const userIdIndex = selectedUserIds.findIndex((id) => {
        return id == userId;
      });

      const prevSelectedUserIds = [...selectedUserIds];
      prevSelectedUserIds.splice(userIdIndex, 1);

      setSelectedUserIds(prevSelectedUserIds);
    }
  };

  // Mount & Update
  useEffect(() => {
    if (searchParams.get("page")) {
      fetchUsers();
    }
  }, [searchParams.get("page"), searchParams.get("search")]);

  // Mount & Update
  useEffect(() => {
    if (!searchParams.get("page") || Number(searchParams.get("page")) < 1) {
      searchParams.set("page", 1);
      setSearchParams(searchParams);
    } else if (lastPage && Number(searchParams.get("page")) > lastPage) {
      searchParams.set("page", lastPage);
      setSearchParams(searchParams);
    }
  }, [lastPage]);

  return (
    <AdminLayout
      title="Users Management"
      description="Managing our users"
      rightSection={
        <div className="flex gap-2 mt-4">
          {selectedUserIds.length ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="h-6 w-6 mr-2" />
                  Delete {selectedUserIds.length} User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Users</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>{selectedUserIds.length}</strong> users?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteUser}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}

          <Link to="/admin/users/create">
            <Button>
              <IoAdd className="h-6 w-6 mr-2" />
              Add User
            </Button>
          </Link>
        </div>
      }
    >
      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Search */}
      <div className="mb-8">
        <Label>Search User Fullname</Label>
        <div className="flex gap-4">
          <Input value={userName} onChange={(e) => setUserName(e.target.value)} className="w-[250px] lg:w-[400px]" placeholder="Search users..." />
          <Button onClick={searchUser}>Search</Button>
        </div>
      </div>

      {/* Table */}
      <Table className="p-4 border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Fullname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Username</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        {userIsLoading ? (
          <TableRow>
            <TableCell colSpan={8}>
              <Spinner />
            </TableCell>
          </TableRow>
        ) : (
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={(checked) => {
                        handleOnCheckedUser(user.id, checked);
                      }}
                      checked={selectedUserIds.includes(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Link to={"/admin/users/edit/" + user.id}>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-6 h-6" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>

      {/* Pagination */}
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <Button disabled={searchParams.get("page") == 1} onClick={handlePreviousPage} variant="ghost">
              <ChevronLeft className="w-6 h-6 mr-2" /> Previous
            </Button>
          </PaginationItem>

          <PaginationItem className="mx-8 font-semibold">Page {searchParams.get("page")}</PaginationItem>

          <PaginationItem>
            <Button disabled={!hasNextPage} onClick={handleNextPage} variant="ghost">
              Next <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </AdminLayout>
  );
};

export default UserManagementPage;
