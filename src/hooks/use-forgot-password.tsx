"use client";

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/lib/actions";

type ForgotPasswordData = {
  email: string;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const result = await forgotPassword(data);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
};
