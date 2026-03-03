"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { createAiAccessDeniedError } from "@/utils/aiErrors";

export const getCurrentUserCanUseAI = async () => {
  const user = auth();

  if (!user.userId) {
    return false;
  }

  const fullUserData = await clerkClient.users.getUser(user.userId);
  return Boolean(fullUserData.privateMetadata?.canUseAI);
};

export const assertCurrentUserCanUseAI = async () => {
  const user = auth();
  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  const canUseAI = await getCurrentUserCanUseAI();
  if (!canUseAI) {
    throw createAiAccessDeniedError();
  }

  return true;
};
