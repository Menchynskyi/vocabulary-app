const aiRateLimitPrefix = "AI_RATE_LIMIT_RETRY_AFTER_SECONDS:";
const aiAccessDeniedCode = "AI_ACCESS_DENIED";

const parseRetryAfterFromText = (message: string) => {
  const prefixed = message.match(
    new RegExp(
      `${aiRateLimitPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\d+)`,
    ),
  );
  if (prefixed?.[1]) {
    return Number(prefixed[1]);
  }

  const retryInSeconds = message.match(/Please retry in\s+([\d.]+)s/i);
  if (retryInSeconds?.[1]) {
    return Math.max(1, Math.ceil(Number(retryInSeconds[1])));
  }

  const retryDelaySeconds = message.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
  if (retryDelaySeconds?.[1]) {
    return Math.max(1, Number(retryDelaySeconds[1]));
  }

  return null;
};

export const getAiRetryAfterSeconds = (error: unknown) => {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : String(error);
  return parseRetryAfterFromText(message);
};

export const isAiRateLimitError = (error: unknown) => {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : String(error);
  return (
    message.includes(aiRateLimitPrefix) ||
    /429/i.test(message) ||
    /too many requests/i.test(message) ||
    /quota exceeded/i.test(message) ||
    /retryDelay/i.test(message)
  );
};

export const createAiRateLimitError = (retryAfterSeconds: number) =>
  new Error(`${aiRateLimitPrefix}${Math.max(1, Math.ceil(retryAfterSeconds))}`);

export const createAiAccessDeniedError = () => new Error(aiAccessDeniedCode);

export const isAiAccessDeniedError = (error: unknown) => {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : String(error);
  return message === aiAccessDeniedCode;
};
