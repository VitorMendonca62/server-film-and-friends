type ObjectKeyMsg = {
  required: string;
  max: string;
  min: string;
  email: string;
  yup: Yup.StringSchema<string>;
};

type Method = "get" | "post" | "delete" | "patch";
type Key = "name" | "username" | "email" | "password";
type KeyMsg = "required" | "yup" | "min" | "max" | "email";

interface IData {
  name?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
  email?: string | undefined;
}