import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";

export const UserForm = (props) => {
  const { cardTitle, form, state, onSubmit } = props;

  return (
    <Form {...form}>
      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[540px]">
        <Card>
          <CardHeader>
            <CardTitle>{cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="role">Role</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Frontend">Frontend</SelectItem>
                        <SelectItem value="Backend">Backend</SelectItem>
                        <SelectItem value="UIUX">UIUX</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="DataScientist">DataScientist</SelectItem>
                        <SelectItem value="DataAnalyst">DataAnalyst</SelectItem>
                        <SelectItem value="ITSupport">ITSupport</SelectItem>
                        <SelectItem value="ProductManager">ProductManager</SelectItem>
                        <SelectItem value="ProjectManager">ProjectManager</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Role is required</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Fullname is required and must only contain alphabetic characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Please enter a valid email address (e.g., example@mail.com)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>Phone number must be at least 10 digits (e.g., 08123456789)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>Password has to 8 characters or more</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>Make sure your passwords match</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="flex flex-col space-y-4 w-full">
              <Button disabled={state} type="submit">
                {state ? "Processing..." : "Submit"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
