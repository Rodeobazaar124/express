import Joi from "joi";
import { ResponseError } from "../error/response-error";


// Validasi id
export const IdValidation = Joi.number().min(1).positive().required();


// fungsi validasi, disini diperlukan skema dan requestnya,
// Bila skema dan request sudah sama maka return value yang diberikan
// Jika belum kirim kan respon 400 dan error kolom tidak lengkap
export const Validate = (schema: Joi.Schema, request: any) => {
  const result = schema.validate(request, {
    abortEarly: false,
  });

  if (result.error) {
    const errorMessage = result.error.details
      .map((detail) => detail.message)
      .join(", ");
    throw new ResponseError(400, errorMessage);
  } else {
    return result.value;
  }
};
