import type { ErrorCodes } from "@apollo/client/invariantErrorCodes";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { z } from "zod";

const schema = z.object({
  version: z.string(),
  message: z.number(),
  args: z.array(z.string()),
});

export const ClientError = () => {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<
    [ErrorCodes[number], z.infer<typeof schema>] | null
  >(null);

  useEffect(() => {
    const hash = decodeURIComponent(location.hash.substring(1));

    if (hash) {
      (async () => {
        try {
          const result = schema.safeParse(JSON.parse(hash));

          if (!result.success) {
            throw new Error("Could not parse URL.");
          }

          const { errorCodes }: { errorCodes: ErrorCodes } = await import(
            /* @vite-ignore */
            `https://cdn.jsdelivr.net/npm/@apollo/client@${result.data.version}/invariantErrorCodes.js`
          );

          if (result.data.message in errorCodes) {
            new Error("Error message could not be found.");
          }

          setData([errorCodes[result.data.message], result.data]);
        } catch (error) {
          if (error instanceof Error) {
            setError(error);
          }
        }
      })();
    }
  }, []);

  if (error) {
    return (
      <>
        <h3>⚠️ Unable to fetch error code</h3>
        <blockquote>{error.message}</blockquote>
      </>
    );
  }

  if (!data) {
    return null;
  }

  const [errorCode, result] = data;

  return (
    <>
      {errorCode.message && (
        <>
          <h2>Error message</h2>
          <Markdown>
            {result.args.reduce(
              (acc, arg) => acc.replace(/%[sdfo]/, arg),
              errorCode.message,
            )}
          </Markdown>
        </>
      )}
      <h2>File</h2>
      <p>
        <code>{errorCode.file}</code>
      </p>
      {errorCode.condition && (
        <>
          <h2>Condition</h2>
          <p>
            <code>{errorCode.condition}</code>
          </p>
        </>
      )}
    </>
  );
};
