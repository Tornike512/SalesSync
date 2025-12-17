"use client";

import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/lib/actions";

type ResetPasswordData = {
  reset_token: string;
  new_password: string;
  confirm_password: string;
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const result = await resetPassword(data);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
};
