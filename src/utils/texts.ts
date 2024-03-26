import * as Yup from "yup";


export const textsInputsErrors = {
  name: {
    required: "Nome é obrigatório",
    max: "Nome muito longo",
    min: "Nome muito curto",
    yup: Yup.string()
      .required("Nome é obrigatório")
      .max(40, "Nome muito longo")
      .min(8, "Nome muito curto"),
  },
  username: {
    required: "Apelido é obrigatório",
    max: "Apelido muito longo",
    min: "Apelido muito curto",
    yup: Yup.string()
      .required("Apelido é obrigatório")
      .max(32, "Apelido muito longo")
      .min(4, "Apelido muito curto"),
  },
  email: {
    required: "Email é obrigatório",
    email: "Email inválido",
    yup: Yup.string().required("Email é obrigatório").email("Email inválido"),
  },
  password: {
    required: "Senha é obrigatória",
    min: "A senha é curta demais!",
    yup: Yup.string()
      .required("Senha é obrigatória")
      .min(6, "A senha é curta demais!"),
  },
};