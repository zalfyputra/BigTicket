import { AdminLayout } from "@/components/layout/AdminLayout";
import { UserForm } from "@/components/forms/UserForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const userFormSchema = z
  .object({
    role: z.string().nonempty("Please select a role"),
    fullname: z
      .string()
      .min(3, "Your fullname is too short")
      .max(50, "Your fullname is too long")
      .regex(/^[a-zA-Z\s]+$/, "Your fullname should only contain letters and spaces"),
    email: z.string().email("Invalid email format"),
    phone_number: z
      .string()
      .min(10, "Your phone number is too short")
      .max(15, "Your phone number is too long")
      .regex(/^[0-9]+$/, "Your phone number should only contain digits"),
    username: z
      .string()
      .min(3, "Your username is under 3 characters")
      .max(16, "Your username is over 16 characters")
      .regex(/^[a-z0-9]+$/, "Username can only contain lowercase letters and numbers."),
    password: z.string().min(8, "Your password is under 8 characters"),
    repeatPassword: z.string().min(8, "Your password is under 8 characters"),
  })
  .superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["repeatPassword"],
      });
    }
  });

const EditUserPage = () => {
  const params = useParams();
  const [user, setUser] = useState({
    id: "",
    role: "",
    fullname: "",
    email: "",
    phone_number: "",
    username: "",
    password: "",
  });
  const [userIsLoading, setUserIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      role: user.role || "",
      fullname: user.fullname || "",
      email: user.role || "",
      phone_number: user.phone_number || "",
      username: user.username || "",
      password: user.password || "",
      repeatPassword: user.password || "",
    },
    resolver: zodResolver(userFormSchema),
    reValidateMode: "onSubmit",
  });

  const fetchUser = async () => {
    try {
      const userResponse = await axiosInstance.get("/users/" + params.userId);
      setUser(userResponse.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditUser = async (values) => {
    try {
      setUserIsLoading(true);

      await axiosInstance.patch("/users/" + params.userId, {
        role: values.role,
        fullname: values.fullname,
        email: values.email,
        phone_number: values.phone_number,
        username: values.username,
        password: values.password,
      });

      toast.success("User edited successfully");
      setTimeout(() => {
        navigate("/admin/users");
      }, 2000);
    } catch (err) {
      toast.error("Failed to edit user. Please try again");
      console.log(err);
    } finally {
      setUserIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user.id) {
      form.reset({
        role: user.role || "",
        fullname: user.fullname || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        username: user.username || "",
        password: user.password || "",
        repeatPassword: user.password || "",
      });
    }
  }, [user, form]);

  return (
    <AdminLayout title="Edit Users" description="Editing users">
      {user.id ? (
        <>
          {/* Form */}
          <UserForm cardTitle="Editing User" form={form} state={userIsLoading} onSubmit={handleEditUser} />

          {/* Toaster */}
          <Toaster position="top-center" reverseOrder={false} />
        </>
      ) : null}
    </AdminLayout>
  );
};

export default EditUserPage;
