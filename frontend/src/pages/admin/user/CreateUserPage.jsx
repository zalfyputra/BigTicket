import { AdminLayout } from "@/components/layout/AdminLayout";
import { UserForm } from "@/components/forms/UserForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

const CreateUserPage = () => {
  const [userIsLoading, setUserIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      role: "",
      fullname: "",
      email: "",
      phone_number: "",
      username: "",
      password: "",
      repeatPassword: "",
    },
    resolver: zodResolver(userFormSchema),
    reValidateMode: "onSubmit",
  });

  const handleCreateUser = async (values) => {
    try {
      setUserIsLoading(true);

      const usernameResponse = await axiosInstance.get("/users", {
        params: {
          username: values.username,
        },
      });

      if (usernameResponse.data.length) {
        toast.error("Username is already taken");
        return;
      }

      const emailResponse = await axiosInstance.get("/users", {
        params: {
          email: values.email,
        },
      });

      if (emailResponse.data.length) {
        toast.error("Email is already taken");
        return;
      }

      await axiosInstance.post("/users", {
        role: values.role,
        fullname: values.fullname,
        email: values.email,
        phone_number: values.phone_number,
        username: values.username,
        password: values.password,
      });

      toast.success("User created successfully");
      form.reset();
      setTimeout(() => {
        navigate("/admin/users");
      }, 2000);
    } catch (err) {
      toast.error("Failed to create user. Please try again");
      console.log(err);
    } finally {
      setUserIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Create Users" description="Add new users">
      {/* Form */}
      <UserForm cardTitle="Add a new user" form={form} state={userIsLoading} onSubmit={handleCreateUser} />

      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />
    </AdminLayout>
  );
};

export default CreateUserPage;
