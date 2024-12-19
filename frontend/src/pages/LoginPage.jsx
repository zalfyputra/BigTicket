import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

const loginFormSchema = z.object({
  username: z
    .string()
    .min(3, "Your username is under 3 characters")
    .max(16, "Your username is over 16 characters")
    .regex(/^[a-z0-9]+$/, "Username can only contain lowercase letters and numbers."),
  password: z.string().min(8, "Your password is under 8 characters"),
});

const LoginPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [loginIsLoading, setLoginIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
    reValidateMode: "onSubmit",
  });

  const handleLogin = async (values) => {
    try {
      setLoginIsLoading(true);

      const userResponse = await axiosInstance.post("/users/login", {
        username: values.username,
        password: values.password,
      })

      toast.success("User login successfully");
      form.reset();
      setTimeout(() => {
        navigate("/admin/users");
      }, 2000);

      dispatch({
        type: "USER_LOGIN",
        payload: {
          id: userResponse.data.data.user.id,
          role: userResponse.data.data.user.role,
          fullname: userResponse.data.data.user.fullname,
          accessToken: userResponse.data.data.accessToken
        },
      });

      localStorage.setItem("current-user", userResponse.data.data.user.id);
      localStorage.setItem("accessToken", userResponse.data.data.accessToken)
    } catch (err) {
      toast.error(`${err.response.data}. Please try again`);
    } finally {
      setLoginIsLoading(false);
    }
  };

  return (
    <main className="px-4 container mx-auto py-8 flex flex-col justify-center items-center h-full">
      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="w-full max-w-[540px]">
          <Card>
            <CardHeader>
              <CardTitle>
                <img src="bigbox.svg" alt="BigBox" width={300} className="mx-auto" />
                <h1>Login</h1>
                <p className="text-muted-foreground text-sm font-normal mt-3">Please enter your credentials to access your account</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Username has to be between 3 and 16 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type={isChecked ? "text" : "password"} />
                    </FormControl>
                    <FormDescription>Password has to 8 characters or more</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2">
                <Checkbox onCheckedChange={(checked) => setIsChecked(checked)} id="show-password" />
                <Label htmlFor="show-password">Show Password</Label>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col space-y-4 w-full">
                <Button disabled={loginIsLoading} type="submit">
                  {loginIsLoading ? "Processing..." : "Login"}
                </Button>
                <div className="text-center">
                  <p className="text-sm">
                    Don't have an account?
                    <Link to="/register">
                      <Button variant="link" className="p-1">
                        Register
                      </Button>
                    </Link>
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </main>
  );
};

export default LoginPage;
