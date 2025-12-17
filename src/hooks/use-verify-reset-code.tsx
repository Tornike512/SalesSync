"use client";

import { useMutation } from "@tanstack/react-query";
import { verifyResetCode } from "@/lib/actions";

type VerifyResetCodeData = {
  email: string;
  code: string;
};

export const useVerifyResetCode = () => {
  return useMutation({
    mutationFn: async (data: VerifyResetCodeData) => {
      const result = await verifyResetCode(data);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (!result.data.valid) {
        throw new Error(result.data.message || "Invalid verification code");
      }

      return result.data;
    },
  });
};
