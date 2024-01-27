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
  const [error, setError] = useState<
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

          setError([errorCodes[result.data.message], result.data]);
        } catch (error) {
          console.warn(error);
        }
      })();
    }
  }, []);

  if (!error) {
    return null;
  }

  const [code, result] = error;

  return (
    <>
      {code.message && (
        <>
          <h2>Error message</h2>
          <Markdown>
            {result.args.reduce(
              (acc, arg) => acc.replace(/%[sdfo]/, arg),
              code.message,
            )}
          </Markdown>
        </>
      )}
      <h2>File</h2>
      <p>
        <code>{code.file}</code>
      </p>
      {code.condition && (
        <>
          <h2>Condition</h2>
          <p>
            <code>{code.condition}</code>
          </p>
        </>
      )}
    </>
  );
};
